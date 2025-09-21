import Text "mo:base/Text";
import Principal "mo:base/Principal";

module {
    // Course approval status
    public type CourseStatus = {
        #pending;
        #approved;
        #rejected;
        #under_review;
    };

    // Course difficulty levels
    public type CourseDifficulty = {
        #beginner;
        #intermediate;
        #advanced;
        #expert;
    };

    // Course categories matching your frontend
    public type CourseCategory = {
        #blockchain;
        #trading;
        #ai;
        #motoko;
        #icp;
        #defi;
        #nft;
        #web3;
        #programming;
        #other;
    };

    // Individual lesson/section within a course
    public type Lesson = {
        id: Nat;
        title: Text;
        description: Text;
        content_type: Text; // "video", "text", "interactive", "quiz"
        content_url: ?Text; // URL to video or content
        content_text: ?Text; // Text content for reading materials
        duration_minutes: ?Nat; // Estimated completion time
        order: Nat; // Order within the section
    };

    // Section/Module that groups multiple lessons
    public type Section = {
        id: Nat;
        title: Text;
        description: Text;
        lessons: [Lesson];
        order: Nat; // Order within the course
        status: CourseStatus; // pending, approved, rejected for new sections added to existing courses
        added_at: ?Int; // When this section was added (null for original sections)
        approved_at: ?Int; // When this section was approved
        approved_by: ?Principal; // Admin who approved this section
    };

    // Course content structure
    public type CourseContent = {
        introduction: Text;
        learning_objectives: [Text];
        prerequisites: [Text];
        sections: [Section]; // Changed from lessons to sections
        estimated_duration_hours: Nat;
    };

    // Creator information
    public type CourseCreator = {
        principal_id: Principal;
        name: Text;
        bio: ?Text;
        linkedin: ?Text;
        github: ?Text;
        website: ?Text;
        portfolio: ?Text;
    };

    // Main course structure
    public type Course = {
        id: Nat;
        title: Text;
        description: Text;
        category: CourseCategory;
        difficulty: CourseDifficulty;
        thumbnail_url: ?Text;
        creator: CourseCreator;
        content: CourseContent;
        token_reward: Nat; // Tokens earned upon completion
        price_tokens: Nat; // Cost to unlock the course
        status: CourseStatus;
        created_at: Int; // Timestamp
        updated_at: Int; // Timestamp
        approved_at: ?Int; // Approval timestamp
        approved_by: ?Principal; // Admin who approved
        tags: [Text]; // Keywords for search
        student_count: Nat; // Number of enrolled students
        rating: Float; // Average rating (0.0 - 5.0)
        review_count: Nat; // Number of reviews
    };

    // Course creation request (what creators submit)
    public type CourseSubmission = {
        title: Text;
        description: Text;
        category: CourseCategory;
        difficulty: CourseDifficulty;
        thumbnail_url: ?Text;
        creator_info: {
            name: Text;
            bio: ?Text;
            linkedin: ?Text;
            github: ?Text;
            website: ?Text;
            portfolio: ?Text;
        };
        content: CourseContent;
        token_reward: Nat;
        price_tokens: Nat;
        tags: [Text];
    };

    // Admin approval/rejection data
    public type AdminAction = {
        admin_id: Principal;
        action: CourseStatus; // #approved or #rejected
        timestamp: Int;
        notes: ?Text; // Optional feedback
    };

    // Course enrollment record
    public type CourseEnrollment = {
        course_id: Nat;
        student_id: Principal;
        enrolled_at: Int;
        progress: Float; // 0.0 - 1.0 (percentage)
        completed_at: ?Int;
        current_lesson: ?Nat;
    };

    // Course statistics for creators
    public type CourseStats = {
        course_id: Nat;
        total_enrollments: Nat;
        active_students: Nat;
        completion_rate: Float;
        average_rating: Float;
        total_earnings: Nat; // In tokens
    };
}