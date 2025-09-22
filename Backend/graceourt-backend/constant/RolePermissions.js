const RolePermissions = {
  admin: [
    "property:create",
    "property:update",
    "property:delete",
    "booking:approve",
    "booking:cancel",
    "testimonials:approve",
    "testimonials:delete",
    "user:manage",
    "payment:manage",
  ],

  manager: [
    "property:create",
    "property:update",
    "booking:approve",
    "booking:cancel",
  ],

  guest: ["booking:create", "booking:view-own"],
};

module.exports = RolePermissions;
