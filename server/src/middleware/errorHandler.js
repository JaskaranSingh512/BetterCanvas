const FIELD_LABELS = {
  taskTitle: "task name",
  taskType: "entry type",
  eventDate: "date",
  courseName: "course",
  email: "email",
  password: "password",
};

function toFieldLabel(fieldName) {
  return FIELD_LABELS[fieldName] || fieldName;
}

function buildValidationMessage(err) {
  const missingFields = [];
  const invalidFields = [];

  for (const issue of Object.values(err.errors || {})) {
    if (issue.kind === "required") {
      missingFields.push(toFieldLabel(issue.path));
    } else {
      invalidFields.push(toFieldLabel(issue.path));
    }
  }

  if (missingFields.length > 0) {
    return `Please fill in: ${missingFields.join(", ")}.`;
  }

  if (invalidFields.length > 0) {
    return `Please check: ${invalidFields.join(", ")} and try again.`;
  }

  return "Some information is missing or invalid. Please review your entry and try again.";
}

function mapError(err) {
  if (err?.name === "ValidationError") {
    return {
      status: 400,
      message: buildValidationMessage(err),
    };
  }

  if (err?.name === "CastError") {
    return {
      status: 400,
      message: "We could not process that request. Please refresh the page and try again.",
    };
  }

  if (err?.code === 11000) {
    return {
      status: 409,
      message: "That record already exists. Try a different value.",
    };
  }

  if (err?.status && err?.message) {
    return {
      status: err.status,
      message: err.message,
    };
  }

  return {
    status: 500,
    message: "Something went wrong on our side. Please try again in a moment.",
  };
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const mapped = mapError(err);
  res.status(mapped.status).json({ message: mapped.message });
}
