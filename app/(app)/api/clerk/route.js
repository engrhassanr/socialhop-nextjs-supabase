import { createUser, deleteUser, updateUser } from "@/actions/user";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  const { id, first_name, last_name, email_addresses, image_url, username } =
    evt.data;

  const email_address = email_addresses?.[0].email_address;

  console.log("Event received:", eventType, evt.data);
  console.log("Full event structure:", JSON.stringify(evt, null, 2));
  if (eventType === "user.created") {
    try {
      await createUser({
        id,
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      });
    } catch {
      throw new Error("Failed to save new user in db");
    }
  }

  if (eventType === "user.updated") {
    try {
      await updateUser({
        id,
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      });
    } catch {
      throw new Error("Failed to update user in db");
    }
  }

  if (eventType === "user.deleted") {
    try {
      await deleteUser({ id });
    } catch {
      throw new Error("Failed to delete user in db");
    }
  }

  if (eventType === "email.created") {
    try {
      console.log("Email created event received:", evt.data);

      // Extract user data from email.created event
      const { user_id, email_address } = evt.data;

      if (user_id && email_address) {
        console.log("Creating user from email.created event:", {
          user_id,
          email_address,
        });

        // Create user in database with basic info from email.created event
        await createUser({
          id: user_id,
          email_address: email_address,
          first_name: null,
          last_name: null,
          image_url: null,
          username: null,
        });
        console.log("User created from email.created event");
      }
    } catch (error) {
      console.error("Error handling email.created event:", error);
      throw new Error("Failed to handle email.created event");
    }
  }

  return Response.json({ message: "received" });
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}
