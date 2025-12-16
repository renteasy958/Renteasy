# TODO: Implement GCash Payment Restriction for Adding Boarding House

## Tasks
- [x] Add payment check function in services
- [x] Update addbh.js to include payment validation and modal notification
- [x] Update llhome.js to disable "Add Boarding House" button if payment not set up
- [x] Update CSS to use :disabled pseudo-class for better semantics
- [ ] Test the restriction functionality

## Details
- Prevent landlords from adding boarding houses without GCash account setup
- Use modal notification instead of window alert
- Redirect to profile page if payment not configured
