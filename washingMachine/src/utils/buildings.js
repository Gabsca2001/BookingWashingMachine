const buildings = [
    {
        id: 1,
        italianName: "Palazzina A",
        englishName: "Building A",
        imagePath: "/assets/images/palazzina-a.png",
        washingMachines: [
            {
                id: 1,
                italianName: "Lavatrice 1",
                englishName: "Washing Machine 1",
            }
        ]

    },
    {
        id: 2,
        italianName: "Palazzina C",
        englishName: "Building C",
        imagePath: "/assets/images/palazzina-c.png",
        washingMachines: [
            {
                id: 2,
                italianName: "Lavatrice 2",
                englishName: "Washing Machine 2",
            }
        ],
        dryerMachine: [
            {
                id: 3,
                italianName: "Asciugatrice 1",
                englishName: "Dryer Machine 1",
            }
        ]
    }
];

export default buildings;