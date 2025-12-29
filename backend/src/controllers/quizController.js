import Quiz from "../models/Quiz.js";

export async function createQuiz(req, res) {
  try {
    const { title } = req.body;

    // if (!title) {
    //   return res.status(400).json({ message: "Quiz title is required" });
    // }

    const quiz = await Quiz.create({
      title,
      isActive: true, 
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
