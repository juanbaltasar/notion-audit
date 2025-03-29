import sendEmail, { createEmailBody } from "./utils/mailSender";
import { config } from "./config/config";
import { Problem } from "./types/types";
import {
  getAllChildrenRecursively,
  getDatabaseItems,
} from "./utils/notionIntegration";
import {
  processRequerimientos,
  processPublicacion,
  processSprints,
  processTareas,
} from "./processors";
import { encrypt } from "./utils/passwordEncripter";

const errorList: Problem[] = [];
export const addToList = (itemToAdd: Problem) => {
  errorList.push(itemToAdd);
};

const main = async () => {
  try {
    const databasesToCheck = config.databasesToCheck;

    // const mail = encrypt('notify@fktech.net');
    // const pass = encrypt('Daq76683');

    for (const page of config.applicationsToCheck) {
      const childPages = await getAllChildrenRecursively(page.id);
      for (const childPage of childPages) {
        if (
          childPage.type === "child_database" &&
          databasesToCheck.includes(childPage.child_database.title)
        ) {
          const items = await getDatabaseItems(childPage.id);

          switch (childPage.child_database.title) {
            case "Requerimientos":
              await processRequerimientos(items);
              break;

            case "Publicación (release)":
              await processPublicacion(items);
              break;

            case "Sprints":
              await processSprints(items);
              break;

            case "Tareas":
              await processTareas(items);
              break;

            default:
              console.log("Unknown database:", childPage.child_database.title);
              break;
          }
        }
      }
      sendEmail(
        page.mail,
        page.name,
        "",
        createEmailBody(
        `Despues de una verificacion automatica se detectaron los siguientes errores en los elementos de los que es responsable en el espacio de ${page.name}`,
          errorList
        )
      );
      errorList.length = 0;
    }
  } catch (error) {
    console.error("Error in main process:", error);
  }
};

main();
