✅ 1. Core Models: Address & Person

    Purpose: Store basic information about people and their addresses.

    Usage:

        Address holds street, city, state, and zip for reuse.

        Person links each individual to an address and can be extended to either a Parent or Child profile.

        All Parent and Child entries must first exist as a Person.

✅ 2. Family (Account) Model

    Purpose: Represents a family account that groups parents and children together.

    Usage:

        Family has unique email and optional phone for login and contact purposes.

        Stores a list of parents and children tied to the account.

        When registering a family, create the Family first, then associate Parent and Child profiles.

✅ 3. Profile Models: Parent and Child

    Parent Model:

        Stores individual parent info, linking to Person and Family.

        Can be a driver for carpools and manage carpool groups via CarpoolGroupAdmin.

        Has unique email and phone for individual contact.

        Manages carpool memberships using ParentMembership.

    Child Model:

        Stores child-specific details, linking to Person and Family.

        Tracks booster seat and front seat preferences.

        Manages memberships in carpool groups using ChildMembership.

Usage:

    Create a Person first, then associate it with a Parent or Child.

    Assign Parent and Child to a Family when registering a family.

✅ 4. Carpool Groups, Trip Times, and Carpools

    CarpoolGroup Model:

        Represents a group of families sharing rides.

        CarpoolGroupAdmin tracks which parents are group admins.

        Stores available TripTimes and manages Carpools and memberships.

    CarpoolGroupAdmin Model:

        Manages admin rights for a carpool group.

        Links a parent to a carpool group as an admin.

        Allows multiple admins per group but prevents duplicates.

    TripTime Model:

        Represents times when carpools are available (e.g., "Monday morning").

        Parents and children select preferred times in ParentMembership and ChildMembership.

    Carpool Model:

        Represents a single carpool ride.

        driver (Parent) and passengers (Children) are linked here.

        Tied to a CarpoolGroup and a TripTime.

Usage:

    Create a CarpoolGroup first, then set up available TripTimes.

    Assign admins using CarpoolGroupAdmin.

    Register parents and children in the group using membership tables.

    Schedule rides using Carpool, setting the driver and passengers.

✅ 5. Membership Join Tables for CarpoolGroup Registrations

    ParentMembership & ChildMembership Models:

        Manage many-to-many relationships between parents/children and carpool groups.

        Store selected trip times for each member.

        Ensure uniqueness with @@unique constraints (no duplicate memberships).

Usage:

    Create ParentMembership and ChildMembership to register members to carpool groups.

    Assign trip times from the available options in TripTime.

🚗 How to Use It in Practice

    Registering a Family:

        Create a Family

        Create Address and Person for each parent/child

        Associate Parent and Child profiles with the family

    Managing Carpool Groups:

        Create CarpoolGroup and set up TripTimes

        Assign admins using CarpoolGroupAdmin

        Register parents/children using ParentMembership and ChildMembership

    Scheduling Carpools:

        Create Carpool with a driver and passengers

        Set the carpool to a specific TripTime within a CarpoolGroup