interface IHomeScreenProps {
  isAuthenticated: boolean;
  accessToken: string | null;
  handleSignIn(): void;
  handleSignOut(): void;
}

const HomeScreen = (props: IHomeScreenProps) => {
  return (
    <div style={{ maxHeight: "100vh" }}>
      <h1>
        {props.isAuthenticated ? "You are signed in" : "You are signed out"}
      </h1>
      {props.isAuthenticated ? (
        <div>
          <p>Access Token: {props.accessToken}</p>
          <button onClick={props.handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={props.handleSignIn}>Sign In</button>
      )}
    </div>
  );
};

export default HomeScreen;
