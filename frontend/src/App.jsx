import Login from "./auth/login";
import {useAuth} from "./context/AuthContext";


function App(){
    const {user,logout}=useAuth();

    if(!user){
        return <login/>
    }

    return (
        <div>
            <h1>Welcome {user.email}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default App;