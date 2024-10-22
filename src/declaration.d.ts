declare module "*.css" {
    const content: {
        [key]: string
    };

    export default content;
}

declare module "*.jpg" {
    const content: string;

    export default content;
}