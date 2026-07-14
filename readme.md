# Carpool Manager

## Overview

Carpool Manager is a learning project that explores the challenges of building a family-based ride-sharing coordination system. The application aims to help families and groups organize carpools by managing driver availability, passenger requests, and scheduling across multiple trips.

**Note:** This project is incomplete and served as an early exploration into complex system design. It represents lessons learned in planning large-scale applications, managing schema design, and coordinating multiple interdependent features.

## Core Concept

The system operates around carpool groups where participants can:
- Indicate their availability as drivers for specific routes and times
- Request pickups for specified time slots
- View their driving and passenger schedules
- Receive reminders for upcoming rides

## Planned Features

**Driver & Passenger Management**
- Personal dashboard showing assigned driving times and passengers
- Personal dashboard showing assigned rides and drivers
- Conflict detection for drivers with overlapping carpool commitments

**Communication & Reminders**
- Multi-channel notifications (email and SMS)
- Ride reminders for participants

**Group Administration**
- Family account structure with multiple members created together
- Admin-controlled carpool group creation and time slot definition
- Flexible participation model with driver/passenger preference selection

## Open Questions

Several design decisions remain unresolved:
- Should participation be mandatory for all family members?
- Should carpool groups be publicly discoverable?
- Should joining require admin approval?
- What role should formal invitations play in the process?

## Lessons & Known Issues

This project highlighted important considerations for real-world system design:
- Complex schema requirements (e.g., tracking multiple pickup/drop-off locations per carpool)
- Careful coordination needed between participants, availability, and scheduling
- Early-stage planning is critical before implementation begins

