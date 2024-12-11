

const menuOptions = (() => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  if (!loggedInUser.id) {
    console.error("No logged in user found.");
    return []; // Return an empty array if no user is found
  }

  // Dietitian logic
  if (loggedInUser && loggedInUser.user_type === "Dietitian") {

    return [
      {
        title: "User Management",
        icon: "profile-circle",
        children: [
          {
            title: "Public",
            children: [
              { title: "Manage Public", path: "/admin/page" },
              { title: "Create Public", path: "/admin/create/page" },
            ],
          },
          {
            title: "Dietitian",
            children: [
              { title: "Manage Dietitian", path: "/dietitian/page" },
              { title: "Create Dietitian", path: "/dietitian/create/page" },
            ],
          },
          {
            title: "Desk",
            children: [
              { title: "Manage Desk", path: "/desk/page" },
              { title: "Create Desk", path: "/desk/create/page" },
            ],
          },
          {
            title: "Support",
            children: [
              { title: "Manage Support", path: "/support/page" },
              { title: "Create Support", path: "/support/create/page" },
            ],
          },
          {
            title: "HR",
            children: [
              { title: "Manage HR", path: "/hr/page" },
              { title: "Create HR", path: "/hr/create/page" },
            ],
          },
        ],
      },
      {
        title: "Products Management",
        icon: "profile-circle",
        children: [
          {
            title: "Products",
            children: [
              { title: "Manage Products", path: "/product/page" },
              { title: "Create Products", path: "/product/create/page" },
            ],
          },
        ],
      },
      {
        title: "Orders Management",
        icon: "profile-circle",
        children: [
          {
            title: "Orders",
            children: [{ title: "Manage Orders", path: "/orders/page" }],
          },
        ],
      },
    ];
  }

  // Admin logic
  if (loggedInUser && loggedInUser?.user_type === "Admin") {
    
    return [
      {
        title: "User Management",
        icon: "profile-circle",
        children: [
          {
            title: "Public",
            children: [
              { title: "Manage Public", path: "/admin/page" },
              { title: "Create Public", path: "/admin/create/page" },
            ],
          },
          {
            title: "Dietitian",
            children: [
              { title: "Manage Dietitian", path: "/dietitian/page" },
              { title: "Create Dietitian", path: "/dietitian/create/page" },
            ],
          },
          {
            title: "Desk",
            children: [
              { title: "Manage Desk", path: "/desk/page" },
              { title: "Create Desk", path: "/desk/create/page" },
            ],
          },
          {
            title: "Support",
            children: [
              { title: "Manage Support", path: "/support/page" },
              { title: "Create Support", path: "/support/create/page" },
            ],
          },
          {
            title: "HR",
            children: [
              { title: "Manage HR", path: "/hr/page" },
              { title: "Create HR", path: "/hr/create/page" },
            ],
          },
        ],
      },
      {
        title: "Products Management",
        icon: "profile-circle",
        children: [
          {
            title: "Products",
            children: [
              { title: "Manage Products", path: "/product/page" },
              { title: "Create Products", path: "/product/create/page" },
            ],
          },
        ],
      },
      {
        title: "Orders Management",
        icon: "profile-circle",
        children: [
          {
            title: "Orders",
            children: [{ title: "Manage Orders", path: "/orders/page" }],
          },
        ],
      },
    ];
  }

  // Desk logic
  if (loggedInUser && loggedInUser?.user_type === "Desk") {

    return [
      {
        title: "Bill Management",
        icon: "profile-circle",
        children: [
          {
            title: "Fitback",
            children: [
              { title: "Money Recept", path: "/moneyrecept/page" },
              { title: "Invoice", path: "/invoice/page" },
            ],
          },
          {
            title: "Reset",
            children: [
              { title: "Money Recept", path: "/reset/moneyrecept/page" },
              { title: "Invoice", path: "/reset/invoice/page" },
            ],
          },
          {
            title: "Asthetic",
            children: [
              { title: "Money Recept", path: "/asthetic/moneyrecept/page" },
              { title: "Invoice", path: "/asthetic/invoice/page" },
            ],
          },
        ],
      },
    ] ;
  }

  // Support logic
  if (loggedInUser && loggedInUser?.user_type === "Support") {
    return [
      {
        title: "User Management",
        icon: "profile-circle",
        children: [
          {
            title: "User Information",
            children: [{ title: "All Users", path: "/allusers/page" }],
          },
        ],
      },
    ];
  }

  return []; // Default case
})();

export default menuOptions;

