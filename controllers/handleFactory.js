const AppError = require("../utilies/AppError")

const isDocumentsAvailable = function (doc, next) {
    if(!doc) {
        return new AppError('No document found with that ID', 404)
    }
}

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

        isDocumentsAvailable(doc)

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

exports.updateOne = (Model) => (req, res, next) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

        isDocumentsAvailable(doc)

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
        
    } catch (error) {
        
    }
}