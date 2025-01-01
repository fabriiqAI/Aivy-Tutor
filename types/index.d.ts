import { User } from "@prisma/client";


declare global {

  interface UserProfile extends User {

    interests: string[];

  }

}