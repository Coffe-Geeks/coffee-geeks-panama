import { MongoClient } from "mongodb";

const uri = process.argv[2];
if (!uri) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

// Data extracted from user prompt
const participants = [
  { emails: ["mercadeo@tonoscafebakery.com", "gerencia@tonoscafebakery.com"], name: "Toño's Cafe Bakery", branch: "Costa del Este", lat: 9.0142, lng: -79.4716 },
  { emails: ["manzocfc26@gmail.com"], name: "Sisu Studio", branch: "Calle Uruguay", lat: 8.9818, lng: -79.5222 },
  { emails: ["jmh@foodbarnpa.com"], name: "FoodBarn", branch: "Marbella", lat: 8.9781, lng: -79.5218 },
  { emails: ["hmbatista@kotowa.com", "cicaza@kotowa.com", "jeguia@kotowa.com"], name: "Kotowa Coffee House", branch: "Vía Israel", lat: 8.9866, lng: -79.5065 },
  { emails: ["sara@cafeunido.com"], name: "Café Unido", branch: "Casco Viejo", lat: 8.9529, lng: -79.5350 },
  { emails: ["gerencia@tostocoffee.com", "tostomarketing@gmail.com"], name: "Tosto Coffee House", branch: "Obarrio", lat: 8.9856, lng: -79.5195 },
  { emails: ["Jchaparroxib@gmail.com"], name: "MOMO Coffee Shop", branch: "Obarrio", lat: 8.9860, lng: -79.5190 },
  { emails: ["nathalia11vill@gmail.com", "kewinlai13@gmail.com"], name: "WKDN Specialty Coffee", branch: "Transístmica", lat: 9.0069, lng: -79.5186 },
  { emails: ["sandrao.leto@gmail.com"], name: "Leto Coffee Brew Bar", branch: "Obarrio", lat: 8.9850, lng: -79.5200 },
  { emails: ["muriae26@gmail.com"], name: "Sip Studio", branch: "AltaPlaza", lat: 9.0439, lng: -79.5310 },
  { emails: ["Marketing@cafesietegranos.com"], name: "Siete Granos", branch: "Casco Viejo", lat: 8.9535, lng: -79.5345 },
  { emails: ["katherine.lopez@sofitel.com"], name: "Hotel Sofitel Café Vera", branch: "Hotel Sofitel Casco Viejo", lat: 8.9525, lng: -79.5355 },
  { emails: ["dayanaris27@gmail.com"], name: "Bungla Coffee House", branch: "Calle Uruguay", lat: 8.9815, lng: -79.5225 },
  { emails: ["cabreracoffeebrew@gmail.com", "yeneav@icloud.com", "yeneav1306@gmail.com"], name: "Cabrera Coffee Brew House", branch: "Vía Argentina", lat: 8.9902, lng: -79.5284 },
  { emails: ["hmbatista@kotowa.com", "cicaza@kotowa.com", "jeguia@kotowa.com"], name: "Heritage by Kotowa Farms", branch: "Boquete", lat: 8.7766, lng: -82.4347 },
  { emails: ["mercadeo@tonoscafebakery.com", "gerencia@tonoscafebakery.com"], name: "Toño's Factory", branch: "Corozal", lat: 8.9815, lng: -79.5807 },
  { emails: ["pablo.martinez@miramarpanama.com", "giovanni.cerabona@miramarpanama.com"], name: "Hotel InterContinental Miramar Panamá", branch: "Ave Balboa", lat: 8.9723, lng: -79.5244 },
  { emails: ["gabriele@pedromandinga.com"], name: "Pedro Mandinga Rum Bar", branch: "Ciudad del Saber", lat: 9.0039, lng: -79.5843 },
  { emails: ["julio@valentinosiestocigars.com"], name: "Valentino Siesto Club", branch: "San Francisco", lat: 8.9912, lng: -79.5034 },
  { emails: ["pauloalfaro97@gmail.com"], name: "Olympia", branch: "Casco Viejo", lat: 8.9540, lng: -79.5340 },
  { emails: ["lgarcia@hlcpanama.com"], name: "Hotel La Compañía", branch: "Casco Viejo", lat: 8.9530, lng: -79.5360 }
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const col = client.db().collection("users");
    
    let updatedCount = 0;
    
    for (const p of participants) {
      // Find the user by any of their emails or exact name match
      // If there are duplicates in emails (like Kotowa and Toños), we must also match the name or branch
      // Let's get all matching users, then we update the one that best matches the name
      
      const emailQuery = { email: { $in: p.emails.map(e => e.toLowerCase()) } };
      let user = await col.findOne({
        $and: [
          emailQuery,
          { cafeteriaName: { $regex: new RegExp(p.name.split(" ")[0], "i") } } // Match at least first word of name
        ]
      });
      
      if (!user) {
         // Fallback: Just by email
         const users = await col.find(emailQuery).toArray();
         if (users.length === 1) {
           user = users[0];
         } else if (users.length > 1) {
           // Try to match by branch keyword in neighborhood or cafeteriaName
           user = users.find(u => 
             (u.cafeteriaName && u.cafeteriaName.toLowerCase().includes(p.name.split(" ")[0].toLowerCase())) ||
             (u.neighborhood && u.neighborhood.toLowerCase().includes(p.branch.split(" ")[0].toLowerCase()))
           );
         }
      }
      
      if (!user) {
         // Fallback: Just by name regex
         user = await col.findOne({ cafeteriaName: { $regex: new RegExp(p.name, "i") } });
      }

      if (user) {
        await col.updateOne({ _id: user._id }, {
          $set: { locationLat: p.lat, locationLng: p.lng, neighborhood: p.branch }
        });
        console.log(`[OK] Updated ${p.name} (Matched: ${user.cafeteriaName})`);
        updatedCount++;
      } else {
        console.log(`[NOT FOUND] Could not find ${p.name} (${p.emails[0]})`);
      }
    }
    
    console.log(`Finished. Updated ${updatedCount}/${participants.length} participants.`);
  } catch (error) {
    console.error("Error al actualizar participantes:", error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

run();
