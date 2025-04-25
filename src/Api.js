import axios from 'axios';
import Swal from 'sweetalert2';

// const apiUrl = 'http://192.168.31.105:5000'
const apiUrl = 'https://education-1064837086369.asia-south1.run.app'
// const bncUrl = 'http://192.168.31.105:5020'
const bncUrl = `https://callbackend-307816796518.asia-south1.run.app`

export const userApi = {
    createUser : `${apiUrl}/users/createUser`,
    getUser : `${apiUrl}/users/getUser`,
    adminLogin : `${apiUrl}/users/adminLogin`,
    getAllUsers : `${apiUrl}/users/admin/users`,
}

export const bncApi = {
    adminDashboard : `${bncUrl}/admin/dashboard`,
    calllogs : `${bncUrl}/admin/admincalls`,
    getacall : `${bncUrl}/admin/getcalldetails`,
    gettoadysdata : `${bncUrl}/admin/gettoadysdata`,
    getStatement : `${bncUrl}/admin/statement`,
    getuserDashboard : `${bncUrl}/admin/empDashboard`,
    getuserDateDashboard : `${bncUrl}/admin/empDateDash`,
    getUsers : `${bncUrl}/admin/users`,
    createUser : `${bncUrl}/user/signup`,
    filterCalls : `${bncUrl}/admin/filterCalls`,
    removeInvalid : `${bncUrl}/admin/removeInvalid`
}

export const collegeApi  = {
    createCollege : `${apiUrl}/college/ccollege`,
    getColleges : `${apiUrl}/college/gcollege`,
    getCollege : `${apiUrl}/college/gcollegebyid`,
    updateCollege : `${apiUrl}/college/ucollege`,
    removeCollge : `${apiUrl}/college/dcollege`,
    createCourse : `${apiUrl}/college/ccourse `,
    deleteCourse : `${apiUrl}/college/dcourse`,
    getCourses : `${apiUrl}/college/gcourse`,
    createSupport : `${apiUrl}/college/csupport`,
    getSupport : `${apiUrl}/college/gsupport`,
    getSlide : `${apiUrl}/college/gslide`,
    createSlide : `${apiUrl}/college/cslide`,
    dashboard : `${apiUrl}/college/dashboard`,
    suggestLocation : `${apiUrl}/college/suggestLocation`,
    generateDescription : `${apiUrl}/college/helper/generateDescription`,
    getCollegeDetails : `${apiUrl}/college/gcollegebyid`,
    createCategory : `${apiUrl}/college/ccategory`,
    getCategory : `${apiUrl}/college/gcategory`,
    removeCategory : `${apiUrl}/college/dcategory`,
    updateCategory : `${apiUrl}/college/ucategory`,

    createTag : `${apiUrl}/college/ctag`,
    getTag : `${apiUrl}/college/gtag`,
    removeTag : `${apiUrl}/college/dtag`,
    updateTag : `${apiUrl}/college/utag`,
    getAppDetails : `${apiUrl}/college/gappdetails`,
    createAppDetails : `${apiUrl}/college/cappdetails`,
    updateAppDetails : `${apiUrl}/college/uappdetails`,

    correctPath : `${apiUrl}/college/correctpath`,

    createFeesTag : `${apiUrl}/college/cftag`,
    getFeesTag : `${apiUrl}/college/gftag`,
    updateFeesTag : `${apiUrl}/college/uftag`,
    deleteFeesTag : `${apiUrl}/college/rftag`,

    getPrompts : `${apiUrl}/college/gprompt`,
    createPrompts : `${apiUrl}/college/cprompt`,
    updatePrommts : `${apiUrl}/college/uprompt`,
    removePrompts : `${apiUrl}/college/rprompt`,


}

export const distanceApi = {
    createUuser : `${apiUrl}/users/createUser`,
    getUsers : `${apiUrl}/users/getUser`,
    getDistance : `${apiUrl}/college/distance`,
}

 

export const posterFunction = async(uri, formData)=>{
    try{
        const res = await axios.post(uri, formData)
        if(res.status===200 || res.status===201){
            return {success: true, data : res.data}
        }
     
    }catch(e){
        console.error('Error  in posting',e)
        Swal.fire({
            title: 'Error',
            text: e?.response?.data?.message || "Error in submitting form",
            icon: 'error',
            confirmButtonText: 'Okay'
        })
        return {success: false, data : null}

    }
}

export const getterFunction = async(uri)=>{
    try{
        const res = await axios.get(uri)
        if(res.status===200){
            return {success: true, data : res.data}
        }
     
    }catch(e){
        console.error('Error  in getting',e)
        Swal.fire({
            title: 'Error',
            text: e?.response?.data?.message ||e?.message || "Error in submitting form",
            icon: 'error',
            confirmButtonText: 'Okay'
        })
        return {success: false, data : null}
    }
}

export const updaterFunction = async(uri, formData)=>{
    try{
        const res = await axios.put(uri, formData)
        if(res.status===200){
            return {success: true, data : res.data}
        }
     
    }catch(e){
        console.error('Error  in updating',e)
        return {success: false, data : null}
    }
};

export const removerFunction = async(uri)=>{
    try{
        const res = await axios.delete(uri)
        if(res.status===200){
            return {success: true, data : res.data}
        }
     
    }catch(e){
        console.error('Error  in deleting',e)
        return {success: false, data : null}
    }
}