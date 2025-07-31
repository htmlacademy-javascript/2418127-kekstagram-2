const checkLength = (string, length) => (string.length <= length);

// console.log('1. Ожидаю "true", получаю - ', checkLength('Их тут меньше', 20));
// console.log('2. Ожидаю "true", получаю - ', checkLength('Восемнадцатьумукеп', 18));
// console.log('3. Ожидаю "false", получаю - ', checkLength('Тут больше 10 символов', 10));


function isPalindrome (string) {
  const normalizeString = string.replaceAll(' ', '').toLowerCase();
  let reversedString = '';
  for (let i = normalizeString.length - 1; i >= 0; i--) {
    reversedString += normalizeString[i];
  }
  return normalizeString === reversedString;
}

// console.log('1.Ожидаю true, получаю -', isPalindrome('топот'));
// console.log('2.Ожидаю true, получаю -', isPalindrome('ДовОд'));
// console.log('3.Ожидаю false, получаю -', isPalindrome('Кекс'));
// console.log('4.Ожидаю true, получаю -', isPalindrome('Лёша на полке клопа нашёл'));


function isolateNumbers (letterWithNumbers) {
  let result = '';

  letterWithNumbers = letterWithNumbers.toString();

  for(let i = 0; i <= letterWithNumbers.length - 1; i++){
    if (Number.isNaN(parseInt(letterWithNumbers[i], 10)) === false) {
      result += letterWithNumbers[i];
    }
  }
  return result === '' ? NaN : Number(result);
}

// console.log('1. Ожидаю "2023", получаю -', isolateNumbers('2023 год'));
// console.log('2. Ожидаю "2022", получаю -', isolateNumbers('ECMAScript 2022'));
// console.log('3. Ожидаю "105", получаю -', isolateNumbers('1 кефир, 0.5 батона'));
// console.log('4. Ожидаю "7", получаю -', isolateNumbers('агент 007'));
// console.log('5. Ожидаю "NaN", получаю -', isolateNumbers('а я томат'));
// console.log('6. Ожидаю "2023", получаю -', isolateNumbers('2023'));
// console.log('7. Ожидаю "1", получаю -', isolateNumbers('-1'));
// console.log('8. Ожидаю "15", получаю -', isolateNumbers('1.5'));

const convertToMinutes = (timeInString) => {
  const splitTime = timeInString.split(':');
  return parseInt(splitTime[0], 10) * 60 + parseInt(splitTime[1], 10);
};

const checkTimeMeeting = (startDay, finishDay, startMeeting, durationMeeting) => {
  const startDayMinutes = convertToMinutes(startDay);
  const finishDayMinutes = convertToMinutes(finishDay);
  const startMeetingMinutes = convertToMinutes(startMeeting);
  const endMeetingMinutes = startMeetingMinutes + durationMeeting;

  return (
    startMeetingMinutes >= startDayMinutes &&
    endMeetingMinutes <= finishDayMinutes
  );
};

// console.log(checkTimeMeeting('08:00', '17:30', '14:00', 90));
// console.log(checkTimeMeeting('8:0', '10:0', '8:0', 120));
// console.log(checkTimeMeeting('08:00', '14:30', '14:00', 90));
// console.log(checkTimeMeeting('14:00', '17:30', '08:0', 90));
// console.log(checkTimeMeeting('8:00', '17:30', '08:00', 900));
