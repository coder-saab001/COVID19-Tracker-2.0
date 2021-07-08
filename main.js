const getCases=async()=>{
    const response= await fetch("https://api.covid19api.com/summary")
    if(response.status!=200){
        throw new Error(`Something went wrong, status code: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

const getCountries=async()=>{
    const response= await fetch("https://api.covid19api.com/countries")
    if(response.status!=200){
        throw new Error(`Something went wrong, status code: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

const getLoader=()=>{
    return `<div class="spinner-grow text-info" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`
}
const countryListDropDown=document.querySelector("#selectCountry");
const worldData=document.querySelector("#worldData");
const countryData=document.querySelector("#countryData");
const load=document.querySelector("#load");

document.addEventListener('DOMContentLoaded',async()=>{
    load.innerHTML=getLoader();
    const caseData=await getCases();
    // console.log(caseData);
    load.innerHTML="";
    worldData.innerHTML=`<tr>
        <td>${caseData.Global.TotalConfirmed.toLocaleString()}</td>
        <td>${caseData.Global.TotalRecovered.toLocaleString()}</td>
        <td>${caseData.Global.TotalDeaths.toLocaleString()}</td>
        <td>${(caseData.Global.TotalRecovered*100/caseData.Global.TotalConfirmed).toFixed(2)}</td>
    </tr>`

    const countries=await getCountries();
    let countriesOption="";
    countries.forEach(country => {
        countriesOption+=`<option value="${country.ISO2}">${country.Country}</option>`;
    });
    countryListDropDown.innerHTML+=countriesOption;

    countryData.innerHTML=getLoader();
    countryListDropDown.addEventListener('change', function(){
        const countryCode=this.value;
        let i=0;
        for(i=0;i<caseData.Countries.length;i++){
            if(caseData.Countries[i].CountryCode===countryCode){
                countryData.innerHTML=`<tr>
                    <td>${caseData.Countries[i].TotalConfirmed.toLocaleString()}</td>
                    <td>${caseData.Countries[i].TotalRecovered.toLocaleString()}</td>
                    <td>${caseData.Countries[i].TotalDeaths.toLocaleString()}</td>
                    <td>${(caseData.Countries[i].TotalRecovered*100/caseData.Countries[i].TotalConfirmed).toFixed(2)}</td>
                </tr>`
                break;
            }
        }
        if(i===caseData.Countries.length){
            countryData.innerHTML=`<tr>
                <td colspan="4" class="text-center">Data not Found</td>
            </tr>`
        }
    })
});
