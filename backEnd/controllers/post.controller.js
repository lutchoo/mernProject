const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.send(posts);
  } catch (err) {
    console.log("Error to get data : " + err);
    res.status(500).send("Error to get data");
  }
};
module.exports.createPost = async (req, res) => {
  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.updatePost = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("id unknown :" + req.params.id);
    const updatedRecord = {
      message: req.body.message,
    };
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
    );
    if (!updatedPost) return res.status(404).send("No post found with this id");
    res.send(updatedPost);
  } catch (err) {
    console.log("Update error : " + err);
    res.status(500).send("Update error");
  }
};
module.exports.deletePost = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("id unknown :" + req.params.id);
    const deletePost = await PostModel.findByIdAndDelete(req.params.id);
    if (!deletePost) {
      return res.status(404).send("No post found with this id");
    }
    res.send("post supprimer avec succes");
  } catch (err) {
    console.log("delete error : " + err);
    res.status(500).send("Delete error");
  }
};
module.exports.likePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu :" + req.params.id);
  try {
    const likerPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true }
    );
    if (!likerPost) {
      return res.status(404).send("Aucun post trouvé avec cet identifiant");
    }
    const likedPost = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    );
    if (!likedPost) {
      return res.status(404).send("Aucun utilisateur trouvé avec cet identifiant");
    }
    res.send("Post aimé avec succès");
  } catch (err) {
    console.log("Erreur lors de l'aimer le post : " + err);
    res.status(500).send("Erreur lors de l'aimer le post");
  }
};
module.exports.unlikePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu :" + req.params.id);
  try {
    const unlikerPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true }
    );
    if (!unlikerPost) {
      return res.status(404).send("Aucun post trouvé avec cet identifiant");
    }
    const unlikedPost = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
    );
    if (!unlikedPost) {
      return res
        .status(404)
        .send("Aucun utilisateur trouvé avec cet identifiant");
    }
    res.send("Post aimé avec succès");
  } catch (err) {
    console.log("Erreur lors de l'aimer le post : " + err);
    res.status(500).send("Erreur lors de l'aimer le post");
  }
};

module.exports.commentPost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu :" + req.params.id);
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    ); // Utilisez exec() pour retourner une promesse

    if (!updatedPost) {
      return res.status(404).send("Aucun post trouvé avec cet identifiant");
    }

    return res.send(updatedPost);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editCommentPost = async (req, res) => {
  // Vérifie si l'ID est valide
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu :" + req.params.id);
  try {
    // Recherche la publication par son ID
    const post = await PostModel.findById(req.params.id);
    if (!post) 
      return res.status(404).send("Publication non trouvée");
    // Recherche le commentaire par son ID
    const theComment = post.comments.find(comment => comment._id.equals(req.body.commentId));
    console.log(theComment);
    if (!theComment) 
      return res.status(404).send("Commentaire non trouvé");
    // Met à jour le texte du commentaire avec le nouveau texte fourni
    theComment.text = req.body.text;
    // Sauvegarde les modifications dans la base de données
    await post.save();
    // Répond avec la publication mise à jour
    return res.status(200).send(post);
  } catch (err) {
    // Gestion des erreurs
    return res.status(500).send(err.message);
  }
};
module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu :" + req.params.id);
  try{
  const deletePost = await postModel.findByIdAndUpdate(
    req.params.id,
    {
      $pull:{
        comments:{
          _id: req.body.commentId
        }
      }
    },
    {new: true},
  );
  if(!deletePost) return res.status(400).sen('error deletePost not find')

  return res.status(200).send('post deleted with succes')

  }catch(err){
    return res.status(400).send('Error comment not deleted')
  }
};
