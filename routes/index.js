const uuid = require('uuid').v4;
const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const cache = require('../utils/cache');
const calculate = require('../utils/calculate');
const questions = require('../data/questions.json');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    let answers;

    answers = cache.get(id);

    if (!answers) {
      const url = `${process.env.TYPEFORM_API_URL}${process.env.TYPEFORM_FORM_ID}/responses`;

      const { data } = await axios.get(url, {
        params: { query: id },
        headers: { Authorization: `Bearer ${process.env.TYPEFORM_PERSONAL_TOKEN}` },
      });

      answers = _.get(data, 'items[0].answers');

      if (answers) {
        cache.set(id, answers);
      } else {
        throw new Error('Resultado no existe');
      }
    }

    const { results, choices } = calculate(answers);

    res.render('results', { results, questions: Object.values(questions), choices });
  } catch (error) {
    error.status = 404;

    next(error);
  }
});

// Typeform Form
router.get('/', (req, res, next) => {
  const url = process.env.TYPEFORM_FORM_URL + uuid();

  res.render('index', { url });
});

// Typeform Response Webhook
router.post('/', (req, res) => {
  try {
    const formResponse = _.get(req.body, 'form_response');
    const id = _.get(formResponse, 'hidden.id', '');

    if (!id) {
      throw new Error('No id provided');
    }

    const success = cache.set(id, formResponse.answers, 10000);

    if (!success) {
      throw new Error('Error storing to cache');
    }

    res.sendStatus(200);
  } catch (error) {
    error.status = 500;

    next(error);
  }
});

module.exports = router;
