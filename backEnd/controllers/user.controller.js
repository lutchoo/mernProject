const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch {
    console.log("id unknown : " + err);
  }
};

module.exports.userInfo = async (req, res) => {
  // console.log(req.params);
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("id unknown :" + req.params.id);

  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    res.send(user);
  } catch (err) {
    console.log("id unknown : " + err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("id unknown :" + req.params.id);

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.send(updatedUser);
  } catch (err) {
    return res.status(500).send({ message: "Error: " + err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("id unknown :" + req.params.id);

  try {
    const result = await UserModel.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      return res.status(200).json({ message: "Successfully deleted." });
    } else {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToFollow)
  )
    return res.status(400).send("id unknown :");

  try {
    // add to the follower list
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // add to following list
    const followedUser = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } }
    );
    // if (!err) res.status(201).json(docs);
    if (!followedUser) {
      return res.status(404).json({ message: "Followed user not found" });
    }
    res.status(201).json({ message: "Successfully followed." });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("id unknown :");

  try {
    // add to the follower list
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // add to following list
    const followedUser = await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } }
    );
    // if (!err) res.status(201).json(docs);
    if (!followedUser) {
      return res.status(404).json({ message: "Followed user not found" });
    }
    res.status(201).json({ message: "Successfully Unfollowed." });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
