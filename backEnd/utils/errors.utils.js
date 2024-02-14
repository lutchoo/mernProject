module.exports.signupErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorect ou deja pris";

  if (err.message.includes("email")) errors.email = "Email incorect";

  if (err.message.includes("password"))
    errors.password = "le mot de passe doit faire 6 caractere minimum";

  if (err.code === 1100 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.email = "cet pseudo est deja pris";

  if (err.code === 1100 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "cet email est deja enregistrer";

  return errors;
};

module.exports.signinErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email")) errors.email = "Email inconnu";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe ne correspond pas";

  return errors;
};


module.exports.uploadErrors = (err)=>{
  let errors = { format: '', maxSize: ""}

  if (err.message.includes("invalid file"))
    errors.format = "Format invalide";

    if (err.message.includes("max size"))
    errors.format = "le fichier depasse 500ko";

    return errors
}
