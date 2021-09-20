export default async function getCredentials(email, password, tenant){

    let url = 'http://localhost:8080/api/users/login' //url al back
   
    try
    {
        let response = await fetch(url,{
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'},
            body:JSON.stringify({email: email, password: password, tenant: tenant}),
        
        });
        let data = await response.json();
        let rdo = response.status;
        
        return {rdo, data}

    } catch(error)
    {
        console.log("error",error);
    };
}