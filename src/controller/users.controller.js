const getCredentials = async (email, password, tenant)=>{

    let url = 'http://localhost:8080/api/users/login' //url al back
   
    try
    {
        let response = await fetch(url,{
            method: 'POST', 
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({email,password,tenant}),
        
        });
        let data = await response.json();
        let rdo = response.status;
        console.log(data);
        return {rdo, data}

    } catch(error)
    {
        console.log("error",error);
    };
}

module.exports = {
    getCredentials
};