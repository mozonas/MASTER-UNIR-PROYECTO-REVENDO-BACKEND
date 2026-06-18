const editArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const updatedData = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(updatedData, 'categorias_id')) {
      const mappedCategoryId = await resolveCategoryId(updatedData.categorias_id);

      if (!mappedCategoryId) {
        return res.status(400).json({
          status: 'error',
          message: 'Debe indicar una categoría válida'
        });
      }

      updatedData.categorias_id = mappedCategoryId;
    }

    const enums = await getArticleEnums();

    const enumErrors = [
      Object.prototype.hasOwnProperty.call(updatedData, 'tipoEntrega')
        ? validateEnumValue(updatedData.tipoEntrega, enums.tipoEntrega, 'tipoEntrega')
        : null,
      Object.prototype.hasOwnProperty.call(updatedData, 'tipoPago')
        ? validateEnumValue(updatedData.tipoPago, enums.tipoPago, 'tipoPago')
        : null,
      Object.prototype.hasOwnProperty.call(updatedData, 'estadoProducto')
        ? validateEnumValue(updatedData.estadoProducto, enums.estadoProducto, 'estadoProducto')
        : null,
    ].filter(Boolean);

    if (enumErrors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: enumErrors.join(' | ')
      });
    }

    const result = await updateArticle(articleId, updatedData);

    if (result) {
      return res.status(200).json({
        status: "success",
        message: "Artículo actualizado correctamente",
      });
    }

    return res.status(404).json({
      status: 'error',
      message: 'Artículo no encontrado'
    });

  } catch (error) {
    console.error('Error al actualizar el artículo:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.sqlMessage || 'Error al actualizar el artículo'
    });
  }
};