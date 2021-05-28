module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      nom: String,
      type: String,
      prix: Number,
      quantite: Number,
      description: String,
      imageurl: String
    },
   { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tutorial = mongoose.model("pp", schema);
  return Tutorial;
};
