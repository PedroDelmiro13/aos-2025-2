const getTarefa = (sequelize, { DataTypes }) => {
  const Tarefa = sequelize.define("tarefa", {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    concluido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
  });
  return Tarefa;
}
export default getTarefa;