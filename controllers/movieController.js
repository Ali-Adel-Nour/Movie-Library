const movieModel = require('../models/movieModel');
const { findOrCreateDirectorByName } = require('../models/movieModel');
// Example usage in controller
exports.getAllMovies = (req, res) => {
    movieModel.getAllMovies((err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "Success",
            data: rows
        });
    });
};

exports.createMovie = (req, res) => {
    const { title, description, release_year, genre, director_name, image_url, actors } = req.body;

    // Validate input data
    if (!title || !description || !release_year || !genre || !director_name || !Array.isArray(actors) || actors.length === 0) {
        return res.status(400).json({ error: "Please provide all required fields and a non-empty actors array." });
    }

    // Find or create the director by name
    findOrCreateDirectorByName(director_name, (err, director_id) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        console.log("Director ID in createMovie:", director_id); // Debugging log

        // Now create the movie with the correct director_id
        movieModel.createMovie({ title, description, release_year, genre, director_id, image_url, actors }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: "Movie created successfully",
                data: result
            });
        });
    });
};


exports.getMovieById = (req, res) => {
    const id = req.params.id;
    movieModel.getMovieById(id, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "Success",
            data: result
        });
    });
}
exports.updateMovie = (req, res) => {
    const id = req.params.id;
    const { title, description, release_year, genre, director_name, image_url } = req.body;

    // Validate input data
    if (!title || !description || !release_year || !genre || !director_name) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Find or create the director by name
    findOrCreateDirectorByName(director_name, (err, director_id) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Log to verify director_id
        console.log("Director ID in updateMovie:", director_id);

        // Now update the movie with the correct director_id
        movieModel.updateMovie(id, { title, description, release_year, genre, director_id, image_url }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                message: "Movie updated successfully",
                data: result
            });
        });
    });
};




exports.deleteMovie = (req, res) => {
    const id = req.params.id;
    movieModel.deleteMovie(id, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "Movie deleted successfully",
            data:  result + " rows deleted with id: " + id
        });
    });
}

// Controller function to handle adding actors to a movie
exports.addActorsToMovie = (req, res) => {
    const { movie_id, actors } = req.body;

    // Check if 'movie_id' is a number
    if (typeof movie_id !== 'number') {
        return res.status(400).json({ error: "'movie_id' must be a number." });
    }
    // Check if 'actors' is a number (single actor) or an array
    let actorIds = [];
    if (Array.isArray(actors)) {
        actorIds = actors;
    } else if (typeof actors === 'number') {
        actorIds = [actors];  // Wrap single actor ID in an array
    } else {
        return res.status(400).json({ error: "'actors' must be a number or an array of actor IDs." });
    }

    movieModel.addActorsToMovie(movie_id, actors, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: result });
        }
    });
};

// Controller function to get a movie with its actors
exports.getMovieWithActors = (req, res) => {
    const { id } = req.params;

    movieModel.getMovieWithActors(id, (err, movie) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Return full movie details including actors
        return res.status(200).json({ message: "Success", movie });
    });
};

// exports.getMovieWithActors = (req, res) => {
//     const { id } = req.params;
//
//     movieModel.getMovieWithActors(id, (err, actors) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//         } else {
//             res.status(200).json({ message: "Success", data: actors });
//         }
//     });
// };