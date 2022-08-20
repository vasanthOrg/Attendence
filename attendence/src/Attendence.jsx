import { useEffect } from 'react';
import attendence from  './attendence.json';

 
const Attendence = () => {
  const attedenceList = attendence.map(x => { return { ...x, date: new Date(x.date) } });

  useEffect(() => {
    calculateSalary('Feb' ,'2020')
  },[]);

  let femaleEmpTotalSalary = 0;
  let maleEmpTotalSalary = 0;
  let bonus = 0;
  let basicSalary = 0;
  let totalOverTimesalary = 0;

  const calculateTotalSalaryByGender = (gender, value) => {
    if(gender == 'Male'){
        maleEmpTotalSalary = maleEmpTotalSalary + value;
    } else if(gender == 'Female') {
        femaleEmpTotalSalary = femaleEmpTotalSalary + value;
    }
  };

 const calculateSalary = (month, year) => {

    femaleEmpTotalSalary = 0;
    maleEmpTotalSalary = 0;
    bonus = 0;
    basicSalary = 0;
    totalOverTimesalary = 0;

    const selectedMonthAttendenceList = attedenceList.filter((x) => (x.date > new Date('Jan 31, 2020') && x.date < new Date('Mar 1,2020')));
   
    let grpEmployeesById = {};

    selectedMonthAttendenceList.forEach(x => {
        if(!grpEmployeesById[x.emp_id]){
            grpEmployeesById[x.emp_id] = [];
        }
        grpEmployeesById[x.emp_id].push(x)
    });   

    if(Object.keys(grpEmployeesById).length > 0){
        Object.keys(grpEmployeesById).forEach((empId )=> {

            grpEmployeesById[empId].forEach(emp => {
                if(emp.designation != 'Worker'){
                    if(emp.total_hours >= 8 && (emp.weekday > 1 && emp.weekday < 7)){
                        basicSalary = basicSalary + emp.per_day_salary;
                        calculateTotalSalaryByGender(emp.gender, emp.per_day_salary)
                    } else if((emp.total_hours >= 4 && emp.total_hours < 8) && (emp.weekday > 1 && emp.weekday < 7)){
                        basicSalary = basicSalary + (emp.per_day_salary / 2);
                        calculateTotalSalaryByGender(emp.gender, (emp.per_day_salary / 2));
                        
                    } 
                    
                } else if(emp.designation == 'Worker'){
                    let perHrSalary = emp.per_day_salary / 8;;
                    let extraHrs = emp.total_hours - 8;
                    let overtimeSalary = 0;

                    if(emp.total_hours >= 8 && (emp.weekday > 1 && emp.weekday < 7)){
                       
                        basicSalary = basicSalary + emp.per_day_salary;
                        if(emp.total_hours > 8){
                            overtimeSalary = 2*(extraHrs*perHrSalary); 
                            calculateTotalSalaryByGender(emp.gender, (emp.per_day_salary + overtimeSalary))                           
                         } else {
                            calculateTotalSalaryByGender(emp.gender, emp.per_day_salary); 
                         }

                    } else if((emp.total_hours >= 4 && emp.total_hours < 8) && (emp.weekday > 1 && emp.weekday < 7)){
                        basicSalary = basicSalary + (emp.per_day_salary / 2);
                        calculateTotalSalaryByGender(emp.gender,(emp.per_day_salary / 2))
                    } else if(emp.weekday == 1 || emp.weekday == 7){
                        overtimeSalary = 2* (perHrSalary * emp.total_hours);
                        calculateTotalSalaryByGender(emp.gender, overtimeSalary)
                    }
                    totalOverTimesalary = totalOverTimesalary + overtimeSalary;
                    
                }
            })
        
        })
      
        if(femaleEmpTotalSalary > maleEmpTotalSalary){
            bonus = maleEmpTotalSalary * (0.01)
        } else {
            bonus = femaleEmpTotalSalary * (0.01)
        }

        console.log("basicSalary-->", basicSalary);
        console.log("overtime-->2213586.88", totalOverTimesalary);
        console.log("femaleEmpTotalSalary-->", femaleEmpTotalSalary);
        console.log("maleEmpTotalSalary-->", maleEmpTotalSalary);
        console.log("bonus-->", bonus);
    }
 };


  return (
   <>
   
   </>
  )
}

export default Attendence