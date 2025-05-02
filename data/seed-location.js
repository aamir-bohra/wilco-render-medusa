// const { getConfigFile } = require("medusa-core-utils");
// const fs = require("fs");
// const path = require("path");
// const { readdirSync } = require("fs");

// // Create an async function to run the seeding process
// const run = async () => {
//   // Get Medusa's config
//   const { configModule } = getConfigFile(process.cwd(), "medusa-config");
  
//   // Set up database configuration
//   const DB_CONFIG = {
//     connection: {
//       database: configModule.projectConfig.database_database,
//       host: configModule.projectConfig.database_host,
//       password: configModule.projectConfig.database_password,
//       port: configModule.projectConfig.database_port,
//       ssl: configModule.projectConfig.database_ssl,
//       username: configModule.projectConfig.database_username,
//     },
//   };
  
//   // Use knex directly to avoid TypeORM connection issues
//   const knexConfig = {
//     client: "pg",
//     connection: configModule.projectConfig.database_url || DB_CONFIG.connection,
//   };
  
//   const knex = require("knex")(knexConfig);
  
//   try {
//     // Read seed data
//     const dataPath = path.join(__dirname, "seed-locations.json");
//     const locations = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    
//     // Process each location
//     for (const loc of locations) {
//       // Check if location already exists
//       const existingLoc = await knex("location").where({ id: loc.id }).first();
      
//       if (!existingLoc) {
//         // Insert the location
//         await knex("location").insert({
//           id: loc.id,
//           certification: JSON.stringify(loc.certification),
//           address: JSON.stringify(loc.address)
//         });
        
//         console.log(`Created location: ${loc.id}`);
        
//         // Create time slots for this location
//         for (const time of loc.time_slots) {
//           // Calculate end time
//           const endTime = calculateEndTime(time);
          
//           // Generate a unique ID for the time slot
//           const slotId = `ts_${loc.id}_${time.replace(/[:\s]/g, '')}`;
          
//           // Insert the time slot
//           await knex("time_slot").insert({
//             id: slotId,
//             start_time: time,
//             end_time: endTime,
//             location_id: loc.id
//           });
          
//           console.log(`- Added time slot: ${time} to ${endTime}`);
//         }
//       } else {
//         console.log(`Location ${loc.id} already exists, skipping.`);
//       }
//     }
    
//     console.log("✅ Locations seeded successfully.");
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     // Close the database connection
//     await knex.destroy();
//   }
// };

// // Helper function to calculate the end time (1 hour after start time)
// function calculateEndTime(startTime) {
//   // Parse the time string (e.g., "09:00 AM")
//   const [time, period] = startTime.split(' ');
//   let [hours, minutes] = time.split(':').map(Number);
  
//   // Convert to 24-hour format
//   if (period === 'PM' && hours < 12) {
//     hours += 12;
//   } else if (period === 'AM' && hours === 12) {
//     hours = 0;
//   }
  
//   // Add 1 hour
//   hours = (hours + 1) % 24;
  
//   // Convert back to 12-hour format
//   const newPeriod = hours >= 12 ? 'PM' : 'AM';
//   const newHours = hours % 12 || 12;
  
//   // Format the result
//   return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${newPeriod}`;
// }

// // Call the run function
// run().catch((err) => {
//   console.error("Error seeding locations:", err);
//   process.exit(1);
// });