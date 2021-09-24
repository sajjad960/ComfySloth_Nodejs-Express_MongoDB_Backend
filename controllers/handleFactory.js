const AppError = require("../utilies/AppError");

exports.createOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.create(req.body)

        //send responce
        res.status(201).json({
            status: 'success',
            data: {
                data: doc,
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.getOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id)

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
          }

        res.status(200).json({
            status: 'success',
            data: {
                doc,
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.updateOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

  
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
          }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.deleteOne = (Model) => async (req,res,next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
          }

        res.send('Document successfully deleted!')
    } catch (err) {
        next(err)
    }
}