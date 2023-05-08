import semantic_kernel as sk
from semantic_kernel.kernel import Kernel
from semantic_kernel.core_skills.time_skill import TimeSkill
from skills.calendar_skill import CalendarSkill
import json

SKILLS_SUBDIRS = ['Classification', 'CalendarSemanticSkill',
                  'Chat', 'CookingSkill', 'AllInformationPresentSkill']

ALLOWED_SKILLS = ["Classification", "Chat",
                  "CookingSkill", "AllInformationPresentSkill", "calendar"]


def init_kernel_with_functions(kernel: Kernel):
    # add core skills
    kernel.import_skill(TimeSkill(), "time")
    kernel.import_skill(skill_instance=CalendarSkill(),
                        skill_name="calendar")

    skill_directory_name = "./skills"
    # add semantic skills
    for skill_dir in SKILLS_SUBDIRS:
        kernel.import_semantic_skill_from_directory(
            skill_directory_name, skill_dir)

    # add NativeXSemantic skills


def get_all_skills(kernel: sk.Kernel):
    all_skills = [semantic_skill for semantic_skill in kernel.skills.get_functions_view()._semantic_functions.items(
    )] + [native_skill for native_skill in kernel.skills.get_functions_view()._native_functions.items()]

    available_skills = ""

    for skill_name, skill_functions in all_skills:

        # skip the calendar semantic skill as these are part of the native skill
        if skill_name not in ALLOWED_SKILLS:
            continue

        available_skills += f"skill name: {skill_name}\n"
        for function in skill_functions:
            available_skills += f"  function name: {function.name}\n"
            available_skills += f"  description: {function.description}\n"
            available_skills += "\n"

    return available_skills


async def chat(user_input: str, context: sk.SKContext):
    context.variables["available_skills"] = get_all_skills(context)
    context.variables["user_input"] = user_input
    context.variables["chat_history"] = context.variables.get(
        "chat_history")[1] + user_input + "\n"

    classified_func = await context.skills.get_function(
        "Classification", "Intent").invoke_async(context=context)

    classified_skill_and_func = json.loads(classified_func.result)
    print(f"classified skill and func: {classified_skill_and_func}")
    answer = ""

    try:
        func_to_execute = context.skills.get_function(
            classified_skill_and_func["skill_name"], classified_skill_and_func["function_name"])

        context.variables["function_name"] = classified_skill_and_func["function_name"]
        context.variables["function_params"] = ",".join(
            [param.name for param in func_to_execute.describe().parameters])
        context.variables["function_description"] = func_to_execute.describe(
        ).description

        context.variables["available_info"] = json.dumps(
            context._variables._variables)

        function_info = await context.skills.get_function("AllInformationPresentSkill", "Validation").invoke_async(context=context)
        function_info = function_info.result
        function_info_json = json.loads(function_info)

        print(f"function info: {function_info_json}")

        if function_info_json.get("missing_params", None) is None:
            function_params = function_info_json.get("function_params", {})
            print(f"func params: {function_params}")

            for func_param_key, func_param_value in function_params.items():
                print(f"func param key: {func_param_key}")
                print(f"func param value: {func_param_value}")
                context.variables[func_param_key] = func_param_value

            answer = await func_to_execute.invoke_async(context=context)
            answer = answer.result
            print(answer)
            context["chat_history"] += f"\nUser:> {user_input}\nChatBot:> {answer}\n"
        else:
            answer = f"Missing parameters: {function_info_json.get('missing_params')}"
    except:
        print("exception raised...")
        pass

    if classified_skill_and_func["skill_name"] != "Chat":
        context.variables["user_input"] = "Rewrite the latest answer to sound more like a human friendly chatbot"
        answer = await context.skills.get_function("Chat", "ChatBot").invoke_async(context=context)
        answer = answer.result
        context["chat_history"] += f"\nUser:> {user_input}\nChatBot:> {answer}\n"
    return answer, context
