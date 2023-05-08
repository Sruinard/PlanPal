# Copyright (c) Microsoft. All rights reserved.

"""A basic JSON-based planner for the Python Semantic Kernel"""
import json

from semantic_kernel.kernel import Kernel
from semantic_kernel.orchestration.context_variables import ContextVariables
from .plan import Plan

PROMPT = """
You are a planner for the Semantic Kernel.
Your job is to create a properly formatted JSON plan step by step, to satisfy the goal given.
Create a list of subtasks based off the [GOAL] provided.
Each subtask must be from within the [AVAILABLE FUNCTIONS] list. Do not use any functions that are not in the list.
Base your decisions on which functions to use from the description and the name of the function.
Sometimes, a function may take arguments. Provide them if necessary.
The plan should be as short as possible. 

REMEMBER YOU ARE NOT ALLOWED TO USE ANY OF THE FUNCTIONS THAT ARE NOT IN THE [AVAILABLE FUNCTIONS] LIST!!!!

HERE IS AN EXAMPLE OF A PLAN:

START OF FIRST PLAN:
---------------------------
[AVAILABLE FUNCTIONS]
WriterSkill.Brainstorm
description: Brainstorm ideas
args:
- input: the input to brainstorm about

ShakespeareSkill.shakespeare
description: Write in Shakespearean style
args:
- input: the input to write about

WriterSkill.EmailTo
description: Write an email to a recipient
args:
- input: the input to write about
- recipient: the recipient's email address.

[GOAL]
"Tomorrow is Valentine's day. I need to come up with a few date ideas. She likes Shakespeare so write using his style.
E-mail these ideas to my significant other"

[OUTPUT]
{
        "input": "Valentine's Day Date Ideas",
        "subtasks": [
            {"function": "WriterSkill.Brainstorm"},
            {"function": "ShakespeareSkill.shakespeare"},
            {"function": "WriterSkill.EmailTo", "args": {"recipient": "significant_other"}},
            {"function": "translate", "args": {"language": "French"}}
        ]
    }
<|endoftext|>
    

COMPLETE ONE AND ONLY THE ONE PLAN BELOW:
---------------------------
[AVAILABLE FUNCTIONS]
{{$available_functions}}

[GOAL]
{{$goal}}

[OUTPUT]
"""


class BasicPlanner:
    """
    Basic JSON-based planner for the Semantic Kernel.
    """

    def _create_available_functions_string(self, kernel: Kernel) -> str:
        """
        Given an instance of the Kernel, create the [AVAILABLE FUNCTIONS]
        string for the prompt.
        """
        # Get a dictionary of skill names to all native and semantic functions
        native_functions = kernel.skills.get_functions_view()._native_functions
        semantic_functions = kernel.skills.get_functions_view()._semantic_functions
        native_functions.update(semantic_functions)

        # Create a mapping between all function names and their descriptions
        # and also a mapping between function names and their parameters
        all_functions = native_functions
        skill_names = list(all_functions.keys())
        all_functions_descriptions_dict = {}
        all_functions_params_dict = {}

        for skill_name in skill_names:
            for func in all_functions[skill_name]:
                key = skill_name + "." + func.name
                all_functions_descriptions_dict[key] = func.description
                all_functions_params_dict[key] = func.parameters

        # Create the [AVAILABLE FUNCTIONS] section of the prompt
        available_functions_string = ""
        for name in list(all_functions_descriptions_dict.keys()):
            available_functions_string += name + "\n"
            description = all_functions_descriptions_dict[name]
            available_functions_string += "description: " + description + "\n"
            available_functions_string += "args:\n"

            # Add the parameters for each function
            parameters = all_functions_params_dict[name]
            for param in parameters:
                if not param.description:
                    param_description = ""
                else:
                    param_description = param.description
                available_functions_string += (
                    "- " + param.name + ": " + param_description + "\n"
                )
            available_functions_string += "\n"

        return available_functions_string

    async def create_plan_async(
        self,
        goal: str,
        kernel: Kernel,
        prompt: str = PROMPT,
    ) -> Plan:
        """
        Creates a plan for the given goal based off the functions that
        are available in the kernel.
        """

        available_functions_string = self._create_available_functions_string(
            kernel)

        # Create the semantic function for the planner with the given prompt
        planner = kernel.create_semantic_function(
            prompt, max_tokens=1000, temperature=0.8
        )

        # Create the context for the planner
        context = ContextVariables()
        # Add the goal to the context
        context["goal"] = goal
        context["available_functions"] = available_functions_string
        generated_plan = await planner.invoke_with_vars_async(input=context)
        return Plan(prompt=prompt, goal=goal, plan=generated_plan)

    async def execute_plan_async(self, plan: Plan, kernel: Kernel) -> str:
        """
        Given a plan, execute each of the functions within the plan
        from start to finish and output the result.
        """
        generated_plan = json.loads(plan.generated_plan.result)

        context = ContextVariables()
        context["input"] = generated_plan["input"]
        subtasks = generated_plan["subtasks"]

        for subtask in subtasks:
            skill_name, function_name = subtask["function"].split(".")
            sk_function = kernel.skills.get_function(skill_name, function_name)

            # Get the arguments dictionary for the function
            args = subtask.get("args", None)
            if args:
                for key, value in args.items():
                    context[key] = value
                output = await sk_function.invoke_with_vars_async(input=context)

            else:
                output = await sk_function.invoke_with_vars_async(input=context)

            # Override the input context variable with the output of the function
            context["input"] = output.result

        # At the very end, return the output of the last function
        return output.result
