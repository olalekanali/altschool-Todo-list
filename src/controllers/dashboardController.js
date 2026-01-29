import Task from "../models/Task.js";

/**
 * @desc Render dashboard
 * @route GET /dashboard
 */
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    const pendingTasks = await Task.find({
      user: userId,
      status: "pending",
    });

    const completedTasks = await Task.find({
      user: userId,
      status: "completed",
    });

    res.render("dashboard", {
      username: req.session.user.username,
      pendingTasks,
      completedTasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create task
 * @route POST /tasks
 */
export const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) return res.redirect("/dashboard");

    await Task.create({
      title,
      user: req.session.user._id,
    });

    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Complete task
 * @route POST /tasks/:id/complete
 */
export const completeTask = async (req, res, next) => {
  try {
    await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      { status: "completed" }
    );

    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete task
 * @route POST /tasks/:id/delete
 */
export const deleteTask = async (req, res, next) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user._id,
    });

    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};
