const { Router } = require("express")
const Sequelize = require("sequelize")
const Question = require("./model")
const Answer = require("../Answer/model")
const Test = require("../Test/model")
const Category = require("../Category/model")
const router = new Router()
const auth = require("../Auth/middleware")
const { maxDifficultyLevel } = require("../constants")
const Op = Sequelize.Op
// create a new question
router.post("/question", auth, async (req, res, next) => {
	const { questionContent, categoryId, level } = req.body

	console.log('add question:', questionContent, categoryId, level);
	
	if (questionContent && categoryId) {

		const newQuestion = {
			questionContent,
			initialLevel: level,
			calculatedLevel: null,
			categoryId
		}
		console.log('should be good:', newQuestion);
		
		await Question.create(newQuestion)
			.then(result => res.status(201).json(result))
			.catch(error => console.log("Error while creating new question: ", error))
	} else {
		console.log('something is wrong...');
		
		res.status(400).send({ message: "Please complete all the required fields" })
	}
})
// get all the questions
router.get("/question", auth, (req, res, next) => {
	//intial setup for pagination?
	const limit = req.query.limit || 25
	const offset = req.query.offset || 0
	Question.findAll({
		limit,
		offset,
		include: [
			{
				model: Category,
				attributes: ["topic"]
			},
			{
				model: Answer
			}
		]
	})
		.then(questions => {
			if (!questions) {
				res.status(404).send("No questions found")
			} else {
				return res.send(questions)
			}
		})
		.catch(next)
})
//Edit a question
router.put("/question/:id", (req, res, next) => {
	Question.findByPk(req.params.id)
		.then(question => {
			if (!question) {
				res.status(404).send("question not found")
			} else {
				question.update(req.body).then(updatedQuestion => {
					res.send(updatedQuestion)
				})
			}
		})
		.catch(next)
})
//Delete a question
router.delete("/question/:id", (req, res, next) => {
	Question.findByPk(req.params.id).then(question => {
		if (!question) {
			res.status(404).send("question not found")
		} else {
			question.destroy()
			res.status(200).send(`Destroyed question ${req.params.id}`)
		}
	})
})

// Below can be deleted after combine with another endpoint

// when user taking testId need a new question
// send request with query params of testId and previousAnswerId
// front end make a request as "baseurl/testquestion?testId=id&previousAnswerId=id"
router.get("/test-question", async (req, res, next) => {
	try {
		// get previousAnswerId  from request query params
		const { previousAnswerId, testId } = req.query
		// find the previous answer and question
		const previousAnswer = await Answer.findByPk(previousAnswerId, {
			include: [Question]
		})
		// if there is no previous Answer, there is no previous Question
		// then it is the first question

		const previousQuestion = !previousAnswer ? null : previousAnswer.question
		const correct = !previousAnswer ? false : previousAnswer.correct
		// for first question, correct = false, previousLevel = 0
		// get previousLevel and correctness and calculate level
		const previousLevel = !previousQuestion ? 0 : previousQuestion.initialLevel
		const level =
			!correct || previousLevel === maxDifficultyLevel
				? Number(previousLevel)
				: Number(previousLevel) + 1
		// find questionIds of answers already in the test
		const test = await Test.findByPk(testId)
		const answers = await test.getAnswers()
		const questionIds = answers.map(answer => answer.questionId)
		// find all questions of newLevel excluding the ones already in questionIds

		const questions = await Question.findAll({
			// when there are test model as well, you can exclude questions already in the test
			where: {
				initialLevel: level,
				id: { [Op.notIn]: questionIds }
			}
		})
		// send back a random one
		const question = questions[Math.floor(Math.random() * questions.length)]
		res.send(question)
	} catch (error) {
		next(error)
	}
})

module.exports = router
