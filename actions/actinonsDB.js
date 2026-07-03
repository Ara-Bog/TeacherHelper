// Backward compatibility - re-exports from new repository modules
// These are kept for any remaining imports that haven't been updated yet
export {deleteStudent as deleteUser} from '../database/repositories/studentRepo';
export {deleteGroup} from '../database/repositories/groupRepo';
export {deleteTimetable} from '../database/repositories/timetableRepo';
