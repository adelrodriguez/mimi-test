const candidates = require('../data/candidates.json');
const questions = require('../data/questions.json');
const _ = require('lodash');

function calculate(answers) {
  const choices = answers.map((item) => _.get(item, 'choice.label', ''));

  const results = candidates.map(({ name, id, choices }) => {
    const scores = answers
      // Eliminate questions that have values that are not multiple choice
      .filter((answer) => !!answer.choice)
      .map((answer) => {
        const questionId = _.get(answer, 'field.ref');
        const choice = _.get(answer, 'choice');

        return Number(choices[questionId] === choice.label);
      });

    const total = _.sum(scores);

    const percentage = `${Math.round((total / answers.length) * 100)}%`;

    return { id, name, scores, total, percentage };
  });

  // Sort questions according to answers order
  const sortedQuestions = answers
    .filter((answer) => !!answer.choice)
    .map((answer) => {
      const questionId = _.get(answer, 'field.ref');

      return questions[questionId];
    });

  results.sort((a, b) => {
    return b.total - a.total;
  });

  return { results, choices, questions: sortedQuestions };
}

module.exports = calculate;
