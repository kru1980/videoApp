const getMyDay = () => {
  //   debugger;
  const day = new Date().getDay();
  const daysArr = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let res = daysArr[day];
  console.log(res);
  return daysArr[day];
};

let dataEl = document.getElementById("today");
dataEl.innerHTML = getMyDay();
