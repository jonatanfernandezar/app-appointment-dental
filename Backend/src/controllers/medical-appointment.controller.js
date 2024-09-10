import { pool } from "../database/db.js";

// Ruta para obtener todas las citas (El usuario podra verlas y el admin también, el profesional solo va a ver sus citas asignadas y creadas por el mismo)
export const getAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM appointments');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ruta para obtener una cita por ID (El admin solamente)
export const getAppointmentID = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM appointments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ruta para agregar una nueva cita (El profesional crea sus citas).
export const createAppointment = async (req, res) => {
  const { patient_name, specialty, doctor_name, appointment_date, reason } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO appointments (patient_name, specialty, doctor_name, appointment_date, reason) VALUES (?, ?, ?, ?, ?)', [patient_name, specialty, doctor_name, appointment_date, reason]);
    res.status(201).json({ id: result.insertId, patient_name, specialty, doctor_name, appointment_date, reason });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ruta para actualizar una cita (Nadie puede editar una cita porque al crearse la cita y pagarse, ya se manda notificacion a WhatApp y Correo)
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { patient_name, specialty, doctor_name, appointment_date, reason } = req.body;
  try {
    const [result] = await pool.query('UPDATE appointments SET patient_name = ?, specialty = ?, doctor_name = ?, appointment_date = ?, reason = ? WHERE id = ?', [patient_name, specialty, doctor_name, appointment_date, reason, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id, patient_name, specialty, doctor_name, appointment_date, reason });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ruta para eliminar una cita
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};