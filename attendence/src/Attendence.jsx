import { useEffect, useState } from "react";
import attendence from "./attendence.json";

const Attendence = () => {
  const attedenceList = attendence.map((x) => {
    return { ...x, date: new Date(x.date) };
  });

  useEffect(() => {
    calculateSalary();
  }, []);

  const [totalBonus, setTotalBonus] = useState(0);
  const [basicSalary, setBasicSalary] = useState(0);
  const [totalOverTimesalary, setTotalOverTimesalary] = useState(0);

  const [totalSalary, setTotalSalary] = useState(0);

  let femaleEmpTotalSalary = 0;
  let maleEmpTotalSalary = 0;
  let bonus = 0;
  let basicSal = 0;
  let totOverTimesalary = 0;

  const calculateTotalSalaryByGender = (gender, value) => {
    if (gender == "Male") {
      maleEmpTotalSalary = maleEmpTotalSalary + value;
    } else if (gender == "Female") {
      femaleEmpTotalSalary = femaleEmpTotalSalary + value;
    }
  };

  const calculateSalary = () => {
    femaleEmpTotalSalary = 0;
    maleEmpTotalSalary = 0;
    bonus = 0;
    basicSal = 0;
    totOverTimesalary = 0;

    const selectedMonthAttendenceList = attedenceList.filter(
      (x) =>
        x.date > new Date("Jan 31, 2020") && x.date < new Date("Mar 1,2020")
    );

    let grpEmployeesById = {};

    selectedMonthAttendenceList.forEach((x) => {
      if (!grpEmployeesById[x.emp_id]) {
        grpEmployeesById[x.emp_id] = [];
      }
      grpEmployeesById[x.emp_id].push(x);
    });

    if (Object.keys(grpEmployeesById).length > 0) {
      Object.keys(grpEmployeesById).forEach((empId) => {
        grpEmployeesById[empId].forEach((emp) => {
          if (emp.designation != "Worker") {
            if (emp.total_hours >= 8 && emp.weekday > 1 && emp.weekday < 7) {
              basicSal = basicSal + emp.per_day_salary;
              calculateTotalSalaryByGender(emp.gender, emp.per_day_salary);
            } else if (
              emp.total_hours >= 4 &&
              emp.total_hours < 8 &&
              emp.weekday > 1 &&
              emp.weekday < 7
            ) {
              basicSal = basicSal + emp.per_day_salary / 2;
              calculateTotalSalaryByGender(emp.gender, emp.per_day_salary / 2);
            }
          } else if (emp.designation == "Worker") {
            let perHrSalary = emp.per_day_salary / 8;
            let extraHrs = emp.total_hours - 8;
            let overtimeSalary = 0;

            if (emp.total_hours >= 8 && emp.weekday > 1 && emp.weekday < 7) {
              basicSal = basicSal + emp.per_day_salary;
              if (emp.total_hours > 8) {
                overtimeSalary = 2 * (extraHrs * perHrSalary);
                calculateTotalSalaryByGender(
                  emp.gender,
                  emp.per_day_salary + overtimeSalary
                );
              } else {
                calculateTotalSalaryByGender(emp.gender, emp.per_day_salary);
              }
            } else if (
              emp.total_hours >= 4 &&
              emp.total_hours < 8 &&
              emp.weekday > 1 &&
              emp.weekday < 7
            ) {
              basicSal = basicSal + emp.per_day_salary / 2;
              calculateTotalSalaryByGender(emp.gender, emp.per_day_salary / 2);
            } else if (emp.weekday == 1 || emp.weekday == 7) {
              overtimeSalary = 2 * (perHrSalary * emp.total_hours);
              calculateTotalSalaryByGender(emp.gender, overtimeSalary);
            }
            totOverTimesalary = totOverTimesalary + overtimeSalary;
          }
        });
      });

      if (femaleEmpTotalSalary > maleEmpTotalSalary) {
        bonus = maleEmpTotalSalary * 0.01;
      } else {
        bonus = femaleEmpTotalSalary * 0.01;
      }

      setBasicSalary(basicSal.toFixed(2));
      setTotalOverTimesalary(totOverTimesalary.toFixed(2));
      setTotalBonus(bonus.toFixed(2));

      const totSalary = [basicSal, bonus, totOverTimesalary].reduce(
        (prev, curr) => prev + curr,
        0
      );
      setTotalSalary(totSalary);
    }
  };

  return (
    <>
      <table>
        <tr>
          <td>Basic Salary</td>
          <td>{basicSalary}</td>
        </tr>
        <tr>
          <td>Overtime</td>
          <td>{totalOverTimesalary}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Bonus</td>
          <td>{totalBonus}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Total Salary</td>
          <td>{totalSalary}</td>
        </tr>
      </table>
    </>
  );
};

export default Attendence;
