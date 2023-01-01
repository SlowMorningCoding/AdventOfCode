const fs = require('fs');
const path = require('path');

const getElves = async () => {
  const filePath = path.join(__dirname, 'listOfCalories.txt');
  const foodCarriedByElves = fs.readFileSync(filePath, 'utf8').split(/[\r\n]{4}/);
  const elves = foodCarriedByElves.map(foods => {
    return foods.split(/[\r\n]{2}/)
      .map(s => Number(s))
      .filter(n => n > 0);
  });
  return elves;
};

const getMostCalories = async (elves) => {
  const elvesTotal = elves.map(calories => calories.reduce((accumulator, current) => accumulator + current, 0));
  const elf = elvesTotal.reduce((accumulator, current, index) => current > accumulator.value ? { index, value: current } : accumulator, { index: -1, value: -1 });
  return elf;
};

const getTopThreeCalories = async (elves) => {
  const elvesTotal = elves.map(calories => calories.reduce((accumulator, current) => accumulator + current, 0));
  const topElves = elvesTotal.reduce((accumulator, current, index) => {
    if (current > accumulator[2].value) {
      accumulator.pop();
      accumulator.push({ index, value: current });
      accumulator.sort((a, b) => b.value - a.value );
    }
    return accumulator;
  }, [{ index: -1, value: -1 }, { index: -1, value: -1 }, { index: -1, value: -1 }]);
  
  topElves.push( { index: 'total', value: topElves.reduce((accumulator, current) => accumulator + current.value, 0) });
  return topElves;
};
const main = async () => {
  try {
    const elves = await getElves();
    const elfWithMostCalories = await getMostCalories(elves);
    console.log('Elf With Most Calories');
    console.table(elfWithMostCalories);

    const topThreeElves = await getTopThreeCalories(elves);
    console.log('Top three Elves');
    console.table(topThreeElves);

  } catch (e) {
    console.log(e);
  }
};

main();
