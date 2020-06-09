const candidates = require('../data/candidates.json');
const _ = require('lodash');

function calculate(answers) {
  const choices = answers.map(item => _.get(item, 'choice.label', ''));

  const results = candidates.map((candidate) => {
    let percentage;
  
    const scores = answers.map((answer) => {
      const questionId = _.get(answer, 'field.ref');
      const choice = _.get(answer, 'choice');

      const chosen = candidate.choices[questionId].find(c => (
        c.id === choice.id || c.label === choice.label
      ));

      return chosen.score;
    });

    const total = _.sum(scores);

    if (total <= 0) {
      percentage = '0%';
    } else {
      percentage = `${(total / answers.length) * 100}%`
    }

    return { name: candidate.name, scores, total, percentage };
  });

  results.sort((a, b) => {
    return b.total - a.total;
  })

  return { results, choices };
}

module.exports = calculate;
