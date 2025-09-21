import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Buffer "mo:base/Buffer";

import CourseTypes "./types/course_types";

persistent actor Course {
    // Import types from the course types module
    type Course = CourseTypes.Course;
    type CourseSubmission = CourseTypes.CourseSubmission;
    type CourseStatus = CourseTypes.CourseStatus;
    type CourseCreator = CourseTypes.CourseCreator;
    type AdminAction = CourseTypes.AdminAction;
    type CourseEnrollment = CourseTypes.CourseEnrollment;
    type CourseStats = CourseTypes.CourseStats;
    type CourseCategory = CourseTypes.CourseCategory;
    type CourseDifficulty = CourseTypes.CourseDifficulty;
    type Lesson = CourseTypes.Lesson;
    type Section = CourseTypes.Section;

    // Stable storage for persistence across upgrades
    var courses: [Course] = [];
    var enrollments: [CourseEnrollment] = [];
    var nextCourseId: Nat = 1;
    var adminActions: [AdminAction] = [];

    // Runtime storage (will be rebuilt on upgrade)
    private transient var courseHashMap = HashMap.HashMap<Nat, Course>(0, Nat.equal, func(x: Nat) : Nat32 = Nat32.fromNat(x % (2**32)));
    private transient var creatorCourses = HashMap.HashMap<Principal, [Nat]>(0, Principal.equal, Principal.hash);
    private transient var categoryIndex = HashMap.HashMap<Text, [Nat]>(0, Text.equal, Text.hash);

    // === HELPER FUNCTIONS ===

    private func _categoryToText(category: CourseCategory) : Text {
        switch (category) {
            case (#blockchain) "blockchain";
            case (#trading) "trading";
            case (#ai) "ai";
            case (#motoko) "motoko";
            case (#icp) "icp";
            case (#defi) "defi";
            case (#nft) "nft";
            case (#web3) "web3";
            case (#programming) "programming";
            case (#other) "other";
        };
    };

    private func _difficultyToText(difficulty: CourseDifficulty) : Text {
        switch (difficulty) {
            case (#beginner) "beginner";
            case (#intermediate) "intermediate";
            case (#advanced) "advanced";
            case (#expert) "expert";
        };
    };

    private func _updateIndexes(course: Course) {
        // Update creator index
        let creatorId = course.creator.principal_id;
        switch (creatorCourses.get(creatorId)) {
            case (?existing) {
                // Check if course ID already exists to avoid duplicates
                switch (Array.find(existing, func(id: Nat) : Bool { id == course.id })) {
                    case null {
                        let updatedList = Array.append(existing, [course.id]);
                        creatorCourses.put(creatorId, updatedList);
                    };
                    case (?_) {
                        // Course ID already exists, don't add again
                    };
                };
            };
            case null {
                creatorCourses.put(creatorId, [course.id]);
            };
        };

        // Update category index
        let categoryText = _categoryToText(course.category);
        switch (categoryIndex.get(categoryText)) {
            case (?existing) {
                // Check if course ID already exists to avoid duplicates
                switch (Array.find(existing, func(id: Nat) : Bool { id == course.id })) {
                    case null {
                        let updatedList = Array.append(existing, [course.id]);
                        categoryIndex.put(categoryText, updatedList);
                    };
                    case (?_) {
                        // Course ID already exists, don't add again
                    };
                };
            };
            case null {
                categoryIndex.put(categoryText, [course.id]);
            };
        };
    };

    // Initialize hash maps from stable storage
    private func _initHashMaps() {
        // Clear existing indexes to rebuild them cleanly
        creatorCourses := HashMap.HashMap<Principal, [Nat]>(0, Principal.equal, Principal.hash);
        categoryIndex := HashMap.HashMap<Text, [Nat]>(0, Text.equal, Text.hash);

        // Rebuild course hash map and indexes
        for (course in courses.vals()) {
            courseHashMap.put(course.id, course);

            // Update creator index (with duplicate check)
            let creatorId = course.creator.principal_id;
            switch (creatorCourses.get(creatorId)) {
                case (?existing) {
                    // Check if course ID already exists to avoid duplicates
                    switch (Array.find(existing, func(id: Nat) : Bool { id == course.id })) {
                        case null {
                            let updatedList = Array.append(existing, [course.id]);
                            creatorCourses.put(creatorId, updatedList);
                        };
                        case (?_) {
                            // Course ID already exists, don't add again
                        };
                    };
                };
                case null {
                    creatorCourses.put(creatorId, [course.id]);
                };
            };

            // Update category index (with duplicate check)
            let categoryText = _categoryToText(course.category);
            switch (categoryIndex.get(categoryText)) {
                case (?existing) {
                    // Check if course ID already exists to avoid duplicates
                    switch (Array.find(existing, func(id: Nat) : Bool { id == course.id })) {
                        case null {
                            let updatedList = Array.append(existing, [course.id]);
                            categoryIndex.put(categoryText, updatedList);
                        };
                        case (?_) {
                            // Course ID already exists, don't add again
                        };
                    };
                };
                case null {
                    categoryIndex.put(categoryText, [course.id]);
                };
            };
        };
    };

    // System initialization
    system func preupgrade() {
        courses := Iter.toArray(courseHashMap.vals());
    };

    system func postupgrade() {
        _initHashMaps();
    };

    // Initialize on first deployment
    _initHashMaps();

    // === PUBLIC FUNCTIONS ===

    // Create a new course (submitted by creators)
    public shared({caller}) func createCourse(submission: CourseSubmission) : async Result.Result<Nat, Text> {
        // Verify caller is authenticated
        if (Principal.isAnonymous(caller)) {
            return #err("Authentication required");
        };

        // Create course creator info
        let creator: CourseCreator = {
            principal_id = caller;
            name = submission.creator_info.name;
            bio = submission.creator_info.bio;
            linkedin = submission.creator_info.linkedin;
            github = submission.creator_info.github;
            website = submission.creator_info.website;
            portfolio = submission.creator_info.portfolio;
        };

        // Create the course
        let courseId = nextCourseId;
        let now = Time.now();

        let newCourse: Course = {
            id = courseId;
            title = submission.title;
            description = submission.description;
            category = submission.category;
            difficulty = submission.difficulty;
            thumbnail_url = submission.thumbnail_url;
            creator = creator;
            content = submission.content;
            token_reward = submission.token_reward;
            price_tokens = submission.price_tokens;
            status = #pending;
            created_at = now;
            updated_at = now;
            approved_at = null;
            approved_by = null;
            tags = submission.tags;
            student_count = 0;
            rating = 0.0;
            review_count = 0;
        };

        // Store the course
        courseHashMap.put(courseId, newCourse);
        _updateIndexes(newCourse);

        nextCourseId += 1;

        Debug.print("Course created: " # Nat.toText(courseId) # " by " # Principal.toText(caller));
        #ok(courseId)
    };

    // Get all approved courses (public access)
    public query func getCourses() : async [Course] {
        Array.filter(Iter.toArray(courseHashMap.vals()), func(course: Course) : Bool {
            course.status == #approved
        })
    };

    // Get courses by category
    public query func getCoursesByCategory(category: Text) : async [Course] {
        switch (categoryIndex.get(category)) {
            case (?courseIds) {
                Array.mapFilter(courseIds, func(id: Nat) : ?Course {
                    switch (courseHashMap.get(id)) {
                        case (?course) {
                            if (course.status == #approved) ?course else null
                        };
                        case null null;
                    }
                })
            };
            case null [];
        }
    };

    // Get courses by creator
    public query func getCoursesByCreator(creatorId: Principal) : async [Course] {
        switch (creatorCourses.get(creatorId)) {
            case (?courseIds) {
                Array.mapFilter(courseIds, func(id: Nat) : ?Course {
                    courseHashMap.get(id)
                })
            };
            case null [];
        }
    };

    // Get courses pending approval (admin only)
    public query func getCoursesForApproval() : async [Course] {
        Array.filter(Iter.toArray(courseHashMap.vals()), func(course: Course) : Bool {
            course.status == #pending or course.status == #under_review
        })
    };

    // Get specific course by ID
    public query func getCourseById(courseId: Nat) : async ?Course {
        courseHashMap.get(courseId)
    };

    // === ADMIN FUNCTIONS ===

    // Approve a course (admin function)
    public shared({caller}) func approveCourse(courseId: Nat) : async Result.Result<(), Text> {
        // Note: In production, you should check if caller is an admin
        // For now, any authenticated user can approve for testing
        if (Principal.isAnonymous(caller)) {
            return #err("Authentication required");
        };

        switch (courseHashMap.get(courseId)) {
            case (?course) {
                let updatedCourse: Course = {
                    course with
                    status = #approved;
                    approved_at = ?Time.now();
                    approved_by = ?caller;
                    updated_at = Time.now();
                };

                courseHashMap.put(courseId, updatedCourse);

                // Record admin action
                let action: AdminAction = {
                    admin_id = caller;
                    action = #approved;
                    timestamp = Time.now();
                    notes = null;
                };
                adminActions := Array.append(adminActions, [action]);

                Debug.print("Course approved: " # Nat.toText(courseId) # " by " # Principal.toText(caller));
                #ok()
            };
            case null {
                #err("Course not found")
            };
        }
    };

    // Reject a course (admin function)
    public shared({caller}) func rejectCourse(courseId: Nat, reason: ?Text) : async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Authentication required");
        };

        switch (courseHashMap.get(courseId)) {
            case (?course) {
                let updatedCourse: Course = {
                    course with
                    status = #rejected;
                    updated_at = Time.now();
                };

                courseHashMap.put(courseId, updatedCourse);

                // Record admin action
                let action: AdminAction = {
                    admin_id = caller;
                    action = #rejected;
                    timestamp = Time.now();
                    notes = reason;
                };
                adminActions := Array.append(adminActions, [action]);

                Debug.print("Course rejected: " # Nat.toText(courseId) # " by " # Principal.toText(caller));
                #ok()
            };
            case null {
                #err("Course not found")
            };
        }
    };

    // Set course under review
    public shared({caller}) func setCourseUnderReview(courseId: Nat) : async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Authentication required");
        };

        switch (courseHashMap.get(courseId)) {
            case (?course) {
                let updatedCourse: Course = {
                    course with
                    status = #under_review;
                    updated_at = Time.now();
                };

                courseHashMap.put(courseId, updatedCourse);
                #ok()
            };
            case null {
                #err("Course not found")
            };
        }
    };

        // Add sections to an existing approved course (requires approval)
    public shared(msg) func addSectionsToExistingCourse(courseId: Nat, newSections: [Section]) : async Result.Result<(), Text> {
        switch (courseHashMap.get(courseId)) {
            case null { #err("Course not found") };
            case (?course) {
                // Check if course is approved
                if (course.status != #approved) {
                    return #err("Cannot add sections to course that is not approved");
                };

                // Verify the caller is the original creator
                if (course.creator.principal_id != msg.caller) {
                    return #err("Only the original course creator can add sections");
                };

                // Create sections with pending status and proper timestamps
                let existingSections = course.content.sections;
                let allSections = Buffer.Buffer<Section>(existingSections.size() + newSections.size());

                // Add existing sections (keep their original status)
                for (section in existingSections.vals()) {
                    allSections.add(section);
                };

                // Add new sections with pending status and proper ordering
                let startOrder = existingSections.size();
                for (i in newSections.keys()) {
                    let pendingSection = {
                        newSections[i] with
                        id = startOrder + i;
                        order = startOrder + i;
                        status = #pending; // New sections need approval
                        added_at = ?Time.now();
                        approved_at = null;
                        approved_by = null;
                    };
                    allSections.add(pendingSection);
                };

                // Calculate additional duration from new sections
                var additionalHours : Nat = 0;
                for (section in newSections.vals()) {
                    for (lesson in section.lessons.vals()) {
                        additionalHours += switch(lesson.duration_minutes) {
                            case (?minutes) { (minutes + 59) / 60 }; // Round up to hours
                            case null { 1 }; // Default 1 hour if no duration
                        };
                    };
                };

                // Create updated course content
                let updatedContent = {
                    course.content with
                    sections = Buffer.toArray(allSections);
                    estimated_duration_hours = course.content.estimated_duration_hours + additionalHours;
                };

                // Create updated course
                let updatedCourse = {
                    course with
                    content = updatedContent;
                    updated_at = Time.now();
                };

                // Update the course in storage
                courseHashMap.put(courseId, updatedCourse);

                #ok()
            };
        };
    };

    // Add lectures to an existing section within a course
    public shared(msg) func addLecturesToExistingSection(courseId: Nat, sectionId: Nat, newLectures: [Lesson]) : async Result.Result<(), Text> {
        switch (courseHashMap.get(courseId)) {
            case null { #err("Course not found") };
            case (?course) {
                // Check if course is approved
                if (course.status != #approved) {
                    return #err("Cannot add lectures to course that is not approved");
                };

                // Verify the caller is the original creator
                if (course.creator.principal_id != msg.caller) {
                    return #err("Only the original course creator can add lectures");
                };

                // Find the target section
                let sectionsBuffer = Buffer.Buffer<Section>(course.content.sections.size());
                var sectionFound = false;

                for (section in course.content.sections.vals()) {
                    if (section.id == sectionId) {
                        sectionFound := true;

                        // Add new lectures to existing section
                        let existingLectures = section.lessons;
                        let allLectures = Buffer.Buffer<Lesson>(existingLectures.size() + newLectures.size());

                        // Add existing lectures
                        for (lecture in existingLectures.vals()) {
                            allLectures.add(lecture);
                        };

                        // Add new lectures with proper ordering
                        let startOrder = existingLectures.size();
                        for (i in newLectures.keys()) {
                            let newLecture = {
                                newLectures[i] with
                                id = startOrder + i;
                                order = startOrder + i;
                            };
                            allLectures.add(newLecture);
                        };

                        // Create updated section
                        let updatedSection = {
                            section with
                            lessons = Buffer.toArray(allLectures);
                            status = #pending; // Section needs re-approval when lectures are added
                        };
                        sectionsBuffer.add(updatedSection);
                    } else {
                        sectionsBuffer.add(section);
                    }
                };

                if (not sectionFound) {
                    return #err("Section not found");
                };

                // Calculate additional duration from new lectures
                var additionalHours : Nat = 0;
                for (lecture in newLectures.vals()) {
                    additionalHours += switch(lecture.duration_minutes) {
                        case (?minutes) { (minutes + 59) / 60 }; // Round up to hours
                        case null { 1 }; // Default 1 hour if no duration
                    };
                };

                // Create updated course content
                let updatedContent = {
                    course.content with
                    sections = Buffer.toArray(sectionsBuffer);
                    estimated_duration_hours = course.content.estimated_duration_hours + additionalHours;
                };

                // Create updated course
                let updatedCourse = {
                    course with
                    content = updatedContent;
                    updated_at = Time.now();
                };

                // Update the course in storage
                courseHashMap.put(courseId, updatedCourse);

                #ok()
            };
        };
    };

    // Get all pending sections across all courses for admin approval
    public query func getPendingSectionsForApproval() : async [(Nat, Nat, Section)] {
        let pendingSections = Buffer.Buffer<(Nat, Nat, Section)>(0);

        for ((courseId, course) in courseHashMap.entries()) {
            for (section in course.content.sections.vals()) {
                if (section.status == #pending) {
                    pendingSections.add((courseId, section.id, section));
                };
            };
        };

        Buffer.toArray(pendingSections)
    };

    // Approve a specific section within a course (admin function)
    public shared({caller}) func approveCourseSection(courseId: Nat, sectionId: Nat) : async Result.Result<(), Text> {
        // Note: In production, you should check if caller is an admin
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot approve sections");
        };

        switch (courseHashMap.get(courseId)) {
            case null { #err("Course not found") };
            case (?course) {
                let updatedSections = Buffer.Buffer<Section>(course.content.sections.size());
                var sectionFound = false;

                for (section in course.content.sections.vals()) {
                    if (section.id == sectionId) {
                        let approvedSection = {
                            section with
                            status = #approved;
                            approved_at = ?Time.now();
                            approved_by = ?caller;
                        };
                        updatedSections.add(approvedSection);
                        sectionFound := true;
                    } else {
                        updatedSections.add(section);
                    };
                };

                if (not sectionFound) {
                    return #err("Section not found in course");
                };

                let updatedContent = {
                    course.content with
                    sections = Buffer.toArray(updatedSections);
                };

                let updatedCourse = {
                    course with
                    content = updatedContent;
                    updated_at = Time.now();
                };

                courseHashMap.put(courseId, updatedCourse);
                #ok()
            };
        };
    };

    // === STATISTICS FUNCTIONS ===

    // Get course statistics for creators
    public query func getCourseStats(courseId: Nat) : async ?CourseStats {
        switch (courseHashMap.get(courseId)) {
            case (?course) {
                let enrollmentCount = Array.filter(enrollments, func(e: CourseEnrollment) : Bool {
                    e.course_id == courseId
                }).size();

                let completedCount = Array.filter(enrollments, func(e: CourseEnrollment) : Bool {
                    e.course_id == courseId and e.completed_at != null
                }).size();

                let completionRate = if (enrollmentCount > 0) {
                    Float.fromInt(completedCount) / Float.fromInt(enrollmentCount)
                } else { 0.0 };

                ?{
                    course_id = courseId;
                    total_enrollments = enrollmentCount;
                    active_students = enrollmentCount - completedCount;
                    completion_rate = completionRate;
                    average_rating = course.rating;
                    total_earnings = course.price_tokens * enrollmentCount;
                }
            };
            case null null;
        }
    };

    // Get admin actions log
    public query func getAdminActions() : async [AdminAction] {
        adminActions
    };

    // === UTILITY FUNCTIONS ===

    // Get total number of courses
    public query func getTotalCourses() : async Nat {
        courseHashMap.size()
    };

    // Get courses by status
    public query func getCoursesByStatus(status: CourseStatus) : async [Course] {
        Array.filter(Iter.toArray(courseHashMap.vals()), func(course: Course) : Bool {
            course.status == status
        })
    };

    // Search courses by title or description
    public query func searchCourses(searchQuery: Text) : async [Course] {
        let approvedCourses = Array.filter(Iter.toArray(courseHashMap.vals()), func(course: Course) : Bool {
            course.status == #approved
        });

        Array.filter(approvedCourses, func(course: Course) : Bool {
            Text.contains(course.title, #text searchQuery) or
            Text.contains(course.description, #text searchQuery)
        })
    };
}