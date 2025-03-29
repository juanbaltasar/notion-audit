import { config } from "./config/config";
import { addToList } from "./main";
import { getItemById } from "./utils/notionIntegration";

/**
 * Process items from the Requerimientos database
 * @param items Database items to process
 */
export const processRequerimientos = async (items: any[]) => {
  try {
    for (const item of items) {
      // Regla 1
      const requiredProperties = [
        "ID",
        "Estado",
        "Fecha de Recepción",
        "Origen",
        "Prioridad",
        "Responsable",
        "Etiquetas",
        "Tareas",
        "Archivos Adjuntos",
        "Fecha de Fin",
        "Fecha de Inicio",
        "Estado de Avance",
        "Lead Time",
        "Cycle Time",
      ];
      if (
        !item.properties &&
        requiredProperties.some((prop) => !(prop in item.properties))
      )
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 1,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });

      // Regla 2
      if (
        !item.properties.Nombre ||
        item.properties.Nombre.title[0].plain_text === "Nuevo Requerimiento" ||
        item.properties.Nombre.title[0].plain_text === ""
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 2,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });
      }

      // Regla 3
      if (
        !item.properties["Fecha de Recepción"] ||
        item.properties["Fecha de Recepción"].date === null
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 3,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });
      }

      // Regla 4
      if (!item.properties.Origen || item.properties.Origen.select === null) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 4,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });
      }

      // Regla 5
      if (
        item.properties.Estado &&
        !["Sin empezar"].includes(item.properties.Estado.status.name) &&
        (!item.properties.Prioridad ||
          item.properties.Prioridad.select === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 5,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });
      }

      // Regla 6
      if (
        item.properties.Estado &&
        !["Sin empezar"].includes(item.properties.Estado.status.name) &&
        (!item.properties.Responsable ||
          item.properties.Responsable.people.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 6,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });
      }

      // Regla 7
      if (
        item.properties.Estado &&
        ["En curso", "Listo"].includes(item.properties.Estado.status.name) &&
        (!item.properties["Fecha de Inicio"] ||
          item.properties["Fecha de Inicio"].date === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 7,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });
      }

      // Regla 8
      if (
        item.properties.Estado &&
        ["En análisis", "Aprobado", "En curso", "Listo"].includes(
          item.properties.Estado.status.name
        ) &&
        (!item.properties.Tareas ||
          item.properties.Tareas.relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 8,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });
      }

      // Regla 9
      if (
        item.properties.Estado &&
        ["Listo", "Cancelado"].includes(item.properties.Estado.status.name) &&
        (!item.properties["Fecha de Fin"] ||
          item.properties["Fecha de Fin"].date === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 9,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Requerimiento",
        });
      }
    }

    return true;
  } catch (error) {
    throw error;
    return false;
  }
};

/**
 * Process items from the Publicación (release) database
 * @param items Database items to process
 */
export const processPublicacion = async (items: any[]) => {
  try {
    for (const item of items) {
      // Regla 10
      const requiredPropertiesPublicacion = [
        "ID",
        "Cronograma",
        "Estado",
        "Asignado",
        "Prioridad",
        "Tags",
        "Summary",
        "IA",
        "Componente",
        "Fecha de Entrega",
        "Tareas",
      ];
      if (
        !item.properties ||
        requiredPropertiesPublicacion.some((prop) => !(prop in item.properties))
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 10,
          url: item.url,
          pageName: item.properties.Version?.title[0]?.plain_text || "Unknown",
          pageType: "Publicación",
        });
      }

      // Regla 11
      if (
        !item.properties.Version ||
        item.properties.Version.title[0].plain_text === "Publicación" ||
        item.properties.Version.title[0].plain_text === ""
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 11,
          url: item.url,
          pageName: item.properties.Version?.title[0]?.plain_text || "Unknown",
          pageType: "Publicación",
        });
      }

      // Regla 12
      if (
        !item.properties.Cronograma ||
        !item.properties.Cronograma.date ||
        !item.properties.Cronograma.date.start ||
        !item.properties.Cronograma.date.end
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 12,
          url: item.url,
          pageName: item.properties.Version?.title[0]?.plain_text || "Unknown",
          pageType: "Publicación",
        });
      }

      // Regla 13
      if (
        item.properties.Estado &&
        !["No iniciado"].includes(item.properties.Estado.status.name) &&
        (!item.properties.Asignado ||
          item.properties.Asignado.people.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 13,
          url: item.url,
          pageName: item.properties.Version?.title[0]?.plain_text || "Unknown",
          pageType: "Publicación",
        });
      }

      // Regla 14
      if (
        item.properties.Estado &&
        !["No iniciado"].includes(item.properties.Estado.status.name) &&
        (!item.properties.Prioridad ||
          item.properties.Prioridad.select === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 14,
          url: item.url,
          pageName: item.properties.Version?.title[0]?.plain_text || "Unknown",
          pageType: "Publicación",
        });
      }

      // Regla 15
      if (
        item.properties.Estado &&
        ["Finalizado"].includes(item.properties.Estado.status.name) &&
        (!item.properties.Tareas ||
          item.properties.Tareas.relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 15,
          url: item.url,
          pageName: item.properties.Version?.title[0]?.plain_text || "Unknown",
          pageType: "Publicación",
        });
      }

      // Regla 16
      if (
        item.properties.Estado &&
        ["Finalizado"].includes(item.properties.Estado.status.name) &&
        (!item.properties["Fecha de Entrega"] ||
          item.properties["Fecha de Entrega"].date === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 16,
          url: item.url,
          pageName: item.properties.Version?.title[0]?.plain_text || "Unknown",
          pageType: "Publicación",
        });
      }
    }

    return true;
  } catch (error) {
    throw error;
    return false;
  }
};

/**
 * Process items from the Sprints database
 * @param items Database items to process
 */
export const processSprints = async (items: any[]) => {
  try {
    for (const item of items) {
      // Regla 17
      const requiredPropertiesSprints = [
        "ID",
        "Fechas",
        "Tareas Completadas",
        "Tareas Totales",
      ];
      if (
        !item.properties ||
        requiredPropertiesSprints.some((prop) => !(prop in item.properties))
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 17,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Sprint",
        });
      }

      // Regla 18
      if (
        !item.properties.Fechas ||
        !item.properties.Fechas.date ||
        !item.properties.Fechas.date.start ||
        !item.properties.Fechas.date.end ||
        new Date(item.properties.Fechas.date.start) >=
          new Date(item.properties.Fechas.date.end)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 18,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Sprint",
        });
      }

      // Regla 19
      if (
        item.properties.Estado &&
        ["Past", "Last"].includes(item.properties.Estado.status.name) &&
        item.properties.Tareas &&
        (await Promise.all(
          item.properties.Tareas.relation.map(async (task: any) => {
            const tarea = await getItemById(task.id);
            "properties" in tarea &&
              tarea.properties.Estado &&
              "status" in tarea.properties.Estado &&
              tarea.properties.Estado.status &&
              tarea.properties.Estado.status.name !== "Completada" &&
              tarea.properties.Estado.status.name !== "Cancelada";
          })
        ).then((results) => results.some(Boolean)))
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 19,
          url: item.url,
          pageName: item.properties.Nombre?.title[0]?.plain_text || "Unknown",
          pageType: "Sprint",
        });
      }
    }

    return true;
  } catch (error) {
    throw error;
    return false;
  }
};

/**
 * Process items from the Tareas database
 * @param items Database items to process
 */
export const processTareas = async (items: any[]) => {
  try {
    for (const item of items) {
      // Regla 20
      const requiredPropertiesTareas = [
        "ID",
        "Fecha de Recepción",
        "Requerimiento",
        "Tarea principal",
        "Componente",
        "Tipo",
        "Estado",
        "Responsable",
        "Prioridad",
        "Esfuerzo",
        "Fecha Límite",
        "Etiquetas",
        "Epica",
        "Sprint",
        "Estado de Avance",
        "Publicación (release)",
        "Tarea",
        "Resumen",
        "Fecha de Fin",
        "Fecha de Inicio",
        "Missed Deadline",
        "Tipo de Documento",
      ];
      if (
        !item.properties ||
        requiredPropertiesTareas.some((prop) => !(prop in item.properties))
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 20,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 21
      const genericTaskNames = [
        "Historia de Usuario",
        "Tarea",
        "Análisis Funcional",
        "Diseño",
        "Análisis Técnico",
        "Manual de Usuario",
        "Manual de Instalación",
        "Manual Técnico",
        "Release Notes",
        "Desarrollo",
        "Pruebas",
        "Entregable",
        "Error",
        "Soporte",
        "Solicitud",
        "",
      ];
      if (
        !item.properties.Tarea ||
        !item.properties.Tarea.title ||
        !item.properties.Tarea.title[0] ||
        genericTaskNames.includes(item.properties.Tarea.title[0].plain_text)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 21,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 22
      if (
        !item.properties["Fecha de Recepción"] ||
        item.properties["Fecha de Recepción"].date === null
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 22,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 23
      if (!item.properties.Tipo || item.properties.Tipo.select === null) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 23,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 24
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name !== "Sin empezar" &&
        (!item.properties.Responsable ||
          item.properties.Responsable.people.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 24,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 25
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name !== "Sin empezar" &&
        (!item.properties.Prioridad ||
          item.properties.Prioridad.select === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 25,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 26
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name !== "Sin empezar" &&
        item.properties.Estado.status.name !== "Cancelada" &&
        (!item.properties.Esfuerzo || item.properties.Esfuerzo.select === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 26,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 27
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name !== "Sin empezar" &&
        item.properties.Estado.status.name !== "Cancelada" &&
        (!item.properties["Fecha Límite"] ||
          item.properties["Fecha Límite"].date === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 27,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 28
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name !== "Sin empezar" &&
        (!item.properties.Sprint ||
          item.properties.Sprint.relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 28,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 29
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name === "Completada" &&
        (!item.properties["Fecha de Fin"] ||
          item.properties["Fecha de Fin"].date === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 29,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 30
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name !== "Sin empezar" &&
        (!item.properties["Fecha de Inicio"] ||
          item.properties["Fecha de Inicio"].date === null)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 30,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 31
      if (
        !item.properties["Tipo de Documento"] ||
        item.properties["Tipo de Documento"].multi_select.length === 0
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 31,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 32
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Historia de Usuario" &&
        item.properties.Estado &&
        item.properties.Estado.status &&
        ["En curso", "En revisión", "Completada"].includes(
          item.properties.Estado.status.name
        ) &&
        (!item.properties.Subtareas ||
          item.properties.Subtareas.relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 32,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 33
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Solicitud" &&
        item.properties.Estado &&
        item.properties.Estado.status &&
        ["En curso", "En revisión", "Completada"].includes(
          item.properties.Estado.status.name
        ) &&
        (!item.properties.Subtareas ||
          item.properties.Subtareas.relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 33,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 34
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Incidencia" &&
        item.properties.Estado &&
        item.properties.Estado.status &&
        ["En curso", "En revisión", "Completada"].includes(
          item.properties.Estado.status.name
        ) &&
        (!item.properties.Subtareas ||
          item.properties.Subtareas.relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 34,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 35
      if (!item.properties.Tipo || item.properties.Tipo.select === null) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 35,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 36
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Historia de Usuario" &&
        (!item.properties.Requerimiento ||
          item.properties.Requerimiento.relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 36,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 37
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Análisis" &&
        item.properties["Tipo de Documento"] &&
        item.properties["Tipo de Documento"].multi_select &&
        item.properties["Tipo de Documento"].multi_select[0].name ===
          "Análisis Funcional" &&
        ((!item.properties.Requerimiento ||
          item.properties.Requerimiento.relation.length === 0) ||
        (!item.properties["Tarea principal"] ||
          item.properties["Tarea principal"].relation.length === 0))
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 37,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 38
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Entregable" &&
        (!item.properties.Publicación ||
          item.properties.Publicación.relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 38,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 39
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Diseño" &&
        item.properties["Tipo de documento"] &&
        item.properties["Tipo de documento"].select &&
        item.properties["Tipo de documento"].select.name === "Diseño" &&
        (!item.properties.Requerimiento ||
          item.properties.Requerimiento.relation.length === 0) &&
        (!item.properties["Tarea principal"] ||
          item.properties["Tarea principal"].relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 39,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 40
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Documentación" &&
        item.properties["Tipo de documento"] &&
        item.properties["Tipo de documento"].select &&
        item.properties["Tipo de documento"].select.name === "Documentación" &&
        (!item.properties.Requerimiento ||
          item.properties.Requerimiento.relation.length === 0) &&
        (!item.properties["Tarea principal"] ||
          item.properties["Tarea principal"].relation.length === 0)
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 40,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 41-47: Tareas que no pueden ser tareas principales (deben tener una tarea principal)
      const tiposQueDebenTenerTareaPrincipal = [
        { tipo: "Error", regla: 41 },
        { tipo: "Análisis", regla: 42 },
        { tipo: "Diseño", regla: 43 },
        { tipo: "Desarrollo", regla: 44 },
        { tipo: "Documentación", regla: 45 },
        { tipo: "Prueba", regla: 46 },
        { tipo: "Entregable", regla: 47 },
      ];

      if (item.properties.Tipo && item.properties.Tipo.select) {
        const tipoTarea = item.properties.Tipo.select.name;
        const tipoEncontrado = tiposQueDebenTenerTareaPrincipal.find(
          (t) => t.tipo === tipoTarea
        );

        if (
          tipoEncontrado &&
          (!item.properties["Tarea principal"] ||
            item.properties["Tarea principal"].relation.length === 0)
        ) {
          addToList({
            pageId: item.properties.ID.unique_id.number,
            error: tipoEncontrado.regla,
            url: item.url,
            pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
            pageType: "Tarea",
          });
        }
      }

      // Regla 48
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Incidencia" &&
        item.properties["Tarea principal"] &&
        item.properties["Tarea principal"].relation.length > 0
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 48,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 49
      if (
        item.properties.Tipo &&
        item.properties.Tipo.select &&
        item.properties.Tipo.select.name === "Solicitud" &&
        item.properties["Tarea principal"] &&
        item.properties["Tarea principal"].relation.length > 0
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 49,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 50
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name === "Completada" &&
        item.properties["Estado de Avance"] &&
        item.properties["Estado de Avance"].rollup.number !== 1
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 50,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 51
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        ["En curso", "Sin empezar"].includes(
          item.properties.Estado.status.name
        ) &&
        item.properties["Estado de Avance"] &&
        item.properties["Estado de Avance"].rollup.number === 1
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 51,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 52
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        ["En curso", "Sin empezar"].includes(
          item.properties.Estado.status.name
        ) &&
        item.properties["Fecha de Fin"] &&
        item.properties["Fecha de Fin"].date !== null
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 52,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }

      // Regla 53
      if (
        item.properties.Estado &&
        item.properties.Estado.status &&
        item.properties.Estado.status.name === "Sin Empezar" &&
        item.properties["Fecha de Inicio"] &&
        item.properties["Fecha de Inicio"].date !== null
      ) {
        addToList({
          pageId: item.properties.ID.unique_id.number,
          error: 53,
          url: item.url,
          pageName: item.properties.Tarea?.title[0]?.plain_text || "Unknown",
          pageType: "Tarea",
        });
      }
    }

    return true;
  } catch (error) {
    throw error;
    return false;
  }
};
