import { db } from '../db.js'
import jwt from 'jsonwebtoken'

export const addPost = (req, res) => {


    const { title, desc, category, img, date, uid } = req.body

    const query = "INSERT INTO posts (title, `desc`, category, img, date, uid) VALUES (?)"
    db.query(query, [[title, desc, category, img, date, uid]], (err, data) => {
        if (err) return res.json({ error: err, message: [title, desc, category, img, date, uid]})

        return res.status(200).json("Post added successfully")


    })

}

export const getPosts = (req, res) => {
    const category = req.query.category
    const query = category ?
        "SELECT * FROM posts WHERE category = ?" :
        "SELECT * FROM posts"

    db.query(query, [category], (err, data) => {
        if (err) return res.json({ error: err })

        return res.status(200).json(data)
    })

}

export const getPost = (req, res) => {
    const id = req.params.id

    const query = `
    SELECT 
        p.id AS post_id,
        p.title AS post_title,
        p.category AS post_category,
        p.desc AS post_desc,
        p.img AS post_img,
        p.date AS post_date,
        u.id AS author_id,
        u.username AS author_name,
        u.img AS author_img
    FROM posts p 
        JOIN users u 
        ON p.uid = u.id 
    WHERE p.id = ?`

    db.query(query, [id], (err, data) => {
        if (err) return res.json({ error: err })

        const result = data[0]
        const response = {
            id: result.post_id,
            title: result.post_title,
            desc: result.post_desc,
            img: result.post_img,
            date: result.post_date,
            category: result.post_category,
            author: {
                id: result.author_id,
                name: result.author_name,
                img: result.author_img
            }
        }
        return res.status(200).json(response)
    })
}

export const deletePost = (req, res) => {




    const postId = req.params.id
    const query = "DELETE FROM posts WHERE id = ?"

    db.query(query, [postId], (err, data) => {
        if (err) return res.json({ error: err })

        return res.status(200).json({ message: "Post deleted successfully" })
    })




}

export const updatePost = (req, res) => {

    const id = req.params.id
    const { title, desc, category, img } = req.body

    const query = "UPDATE posts SET title = ?, `desc` = ?, category = ?, img = ? WHERE id = ?"
    const value = [title, desc, category, img, id]
    db.query(query, value, (err, data) => {
        if (err) return res.json({ error: err })

        return res.status(200).json("Post updated successfully")


    })

}