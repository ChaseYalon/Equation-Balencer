let reactants = prompt('Please enter the reactants (separated by spaces):');
let products = prompt('Please enter the products (separated by spaces):');

function getElements(input) {
  const regex = /([A-Z][a-z]?\d*)/g;
  return input.match(regex) || [];
}

function countElements(elements) {
  const counts = {};
  for (const element of elements) {
    const count = element.match(/[A-Z][a-z]?/)[0];
    const number = parseInt(element.match(/\d+/)?.[0] || '1', 10);
    counts[count] = (counts[count] || 0) + number;
  }
  return counts;
}

function balenceEquation(reactants, products) {
  const reactantElements = reactants.split(' ').flatMap(getElements);
  const productElements = products.split(' ').flatMap(getElements);

  const reactantCounts = countElements(reactantElements);
  const productCounts = countElements(productElements);

  const elements = new Set([...Object.keys(reactantCounts), ...Object.keys(productCounts)]);

  const coefficients = {};
  for (const element of elements) {
    const reactantCount = reactantCounts[element] || 0;
    const productCount = productCounts[element] || 0;
    const lcm = findLCM(reactantCount, productCount);
    coefficients[element] = { reactantCoeff: lcm / reactantCount, productCoeff: lcm / productCount };
  }

  const reactantCoeff = Math.max(...Object.values(coefficients).map(({ reactantCoeff }) => reactantCoeff));
  const productCoeff = Math.max(...Object.values(coefficients).map(({ productCoeff }) => productCoeff));

  console.log(`Balanced equation: ${formatEquation(reactants, reactantCoeff)} -> ${formatEquation(products, productCoeff)}`);
}

function findGCD(a, b) {
  return b === 0 ? a : findGCD(b, a % b);
}

function findLCM(a, b) {
  const gcd = findGCD(a, b);
  return (a * b) / gcd;
}

function formatEquation(equation, coefficient) {
  const components = equation.split(' ').map((component) => {
    const elements = getElements(component);
    return elements.map((element) => {
      const [elem, number] = element.match(/([A-Z][a-z]*)(\d*)/).slice(1);
      const count = number ? parseInt(number, 10) : 1;
      return `${elem}${count}`;
    }).join('');
  });
  return components.map(component => coefficient > 1 ? `${coefficient}(${component})` : component).join(' + ');
}



balenceEquation(reactants, products);
