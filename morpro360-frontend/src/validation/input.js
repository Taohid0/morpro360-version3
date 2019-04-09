function validateInput(obj,arr)
{
    const errorMessages = {
        "name" : "Name cannot be blank",
        "description":"Description cannot be blank",
        "phone":"Phone number cannot be blank",
        "firstName":"Fist name cannot be blank",
        "lastName": "Last name cannot be blank",
        "userName":"Username cannot be blank",
        "email" :"Email cannot be blank",
        "password" : "Password cannot be blank",
        "distance":"Distance  cannot be blank",
        "pickUpDate":"Pick Up Date cannot be blank",
        "dropOffDate":"Drop Off Date cannot be blank",
        "weight":"Weight cannot be blank",
        "rate":"Rate cannot be blank",
        "driverStatus":"Driver Status cannot be blank",
        "productDetails":"Product Details cannot be blank",
        "pickUpAddress":"Pick Up Address cannot be blank",
        "pickUpCity":"Pick Up City cannot be blank",
        "pickUpZipCode":"Pick Up Zip Code cannot be blank",
        "pickUpState":"Pick Up State  cannot be blank",
        "dropOffAddress":"Drop Off Address cannot be blank",
        "dropOffCity":"Drop Off City cannot be blank",
        "dropOffZipCode":"Drop Off Zip Code cannot be blank",
        "dropOffState":"Drop Off State cannot be blank",
        "status":"Status cannot be blank",
        "offererCompanyId":"Offerer Company cannot be blank",
        "brokerId":"Broker cannot be blank",
        "assignedCompanyId":"Assigned Company cannot be blank",
        "assignerUserId":"Assigned User cannot be blank",
        "assignerDriverId":"Asigned Driver cannot be blank",
        "state":"State cannot be blank",
        "city":"City cannot be blank",
        "license":"License cannot be blank",
        "address":"Address cannot be blank",
        "companyId":"Company cannnot be blank",
        "driverId":"Driver cannot blank",
        "note":"Note cannot be blank",
        "loadId":"Load cannot be blank",
        "MC":"MC cannot be blank",
        "DOT":"DOT cannot be blank",
        

    }
    let errors = [];
    for(let field of arr)
    {
        if(!obj[field])
        {
            errors.push(errorMessages[field]);
        }
    }
    if (errors.length===0)
    {
        return false;
    }
    console.log(errors);
    return errors;
}
export default validateInput;