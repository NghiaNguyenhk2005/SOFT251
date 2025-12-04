import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Tutor from '../models/Tutor.model.js';
import Student from '../models/Student.model.js';
import TutorSession from '../models/TutorSession.model.js';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/tutor_system?authSource=admin';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('Starting seed...');

    // 1. Clear existing data
    await User.deleteMany({});
    await Tutor.deleteMany({});
    await Student.deleteMany({});
    await TutorSession.deleteMany({});
    console.log('Cleared existing data');

    // 2. Create Users (Tutors)
    const tutorUsers = await User.insertMany([
      {
        email: 'hung@hcmut.edu.vn',
        fullName: 'Ngô Thanh Hùng',
        role: 'TUTOR',
        status: 'ACTIVE',
        hcmutId: '004001'
      },
      {
        email: 'dung@hcmut.edu.vn',
        fullName: 'Trần Mạnh Dũng',
        role: 'TUTOR',
        status: 'ACTIVE',
        hcmutId: '004002'
      },
      {
        email: 'thao@hcmut.edu.vn',
        fullName: 'Lê Thị Thu Thảo',
        role: 'TUTOR',
        status: 'ACTIVE',
        hcmutId: '004003'
      }
    ]);

    // 3. Create Tutors profiles
    const tutors = await Tutor.insertMany([
      {
        userId: tutorUsers[0]._id,
        subjectIds: ['CO3001', 'CO3005'],
        bio: 'Chuyên gia Công nghệ phần mềm',
        stats: { averageRating: 4.8, totalReviews: 15 }
      },
      {
        userId: tutorUsers[1]._id,
        subjectIds: ['CO2003', 'CO2004'],
        bio: 'Giảng viên Cấu trúc dữ liệu & Giải thuật',
        stats: { averageRating: 4.5, totalReviews: 10 }
      },
      {
        userId: tutorUsers[2]._id,
        subjectIds: ['CO1005', 'CO1006'],
        bio: 'Giảng viên Nhập môn Điện toán',
        stats: { averageRating: 4.9, totalReviews: 20 }
      }
    ]);

    // 4. Create Users (Students)
    const studentUsers = await User.insertMany([
      {
        email: 'an.nguyen@hcmut.edu.vn',
        fullName: 'Nguyễn Hoàng An',
        role: 'STUDENT',
        status: 'ACTIVE',
        hcmutId: '2301001'
      },
      {
        email: 'binh.tran@hcmut.edu.vn',
        fullName: 'Trần Thanh Bình',
        role: 'STUDENT',
        status: 'ACTIVE',
        hcmutId: '2301002'
      }
    ]);

    // 5. Create Student profiles
    const students = await Student.insertMany([
      {
        userId: studentUsers[0]._id,
        mssv: '2301001',
        major: 'KHMT',
        enrollmentYear: 2023
      },
      {
        userId: studentUsers[1]._id,
        mssv: '2301002',
        major: 'KHMT',
        enrollmentYear: 2023
      }
    ]);

    // 6. Create Sessions
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await TutorSession.insertMany([
      {
        tutorId: tutors[0]._id,
        title: 'Tư vấn đồ án CNPM',
        subjectId: 'CO3001',
        description: 'Giải đáp thắc mắc về kiến trúc hệ thống',
        startTime: new Date(tomorrow.setHours(9, 0, 0)),
        endTime: new Date(tomorrow.setHours(11, 0, 0)),
        duration: 120,
        sessionType: 'ONLINE',
        location: 'Google Meet',
        status: 'SCHEDULED',
        participants: []
      },
      {
        tutorId: tutors[0]._id,
        title: 'Review code tuần 5',
        subjectId: 'CO3001',
        description: 'Review code nhóm',
        startTime: new Date(tomorrow.setHours(14, 0, 0)),
        endTime: new Date(tomorrow.setHours(16, 0, 0)),
        duration: 120,
        sessionType: 'OFFLINE',
        location: 'H6-601',
        status: 'SCHEDULED',
        participants: []
      },
      {
        tutorId: tutors[1]._id,
        title: 'Ôn tập Cấu trúc dữ liệu',
        subjectId: 'CO2003',
        description: 'Ôn tập về Tree và Graph',
        startTime: new Date(nextWeek.setHours(8, 0, 0)),
        endTime: new Date(nextWeek.setHours(10, 0, 0)),
        duration: 120,
        sessionType: 'ONLINE',
        location: 'Zoom',
        status: 'SCHEDULED',
        participants: []
      }
    ]);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

connectDB().then(seedData);
