// services/user-service.js
import userModel from "../models/user.js";

export function findAllUsers() {
  return userModel.find();
}

export function findUsersByName(name) {
  return userModel.find({ name });
}

export function findUsersByJob(job) {
  return userModel.find({ job });
}

// ✅ Step 6 requirement: name + job together
export function findUsersByNameAndJob(name, job) {
  return userModel.find({ name, job });
}

export function findUserById(id) {
  return userModel.findById(id);
}

export function addUser(user) {
  const doc = new userModel(user);
  return doc.save();
}

// ✅ Step 6 requirement: delete by id
export function deleteUserById(id) {
  return userModel.findByIdAndDelete(id);
}