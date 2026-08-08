import { Router } from "express";
import passport from "passport";
import { photoUpload } from "../config/uploader"; 
import { UsuarioController } from "../controllers/UsuarioController";
import { CompraController } from "../controllers/CompraController";
import { validateBody } from "../middlewares/validateMiddleware"; 
import { 
    usuarioCreateSchema, 
    usuarioUpdateSchema, 
    usuarioLoginSchema 
} from "../schemas/usuarioSchema";

const router = Router();
router.post("/usuarios", validateBody(usuarioCreateSchema), UsuarioController.gerarUsuario);
router.post("/login", validateBody(usuarioLoginSchema), UsuarioController.loginUsuario);

router.get("/usuario/:id", passport.authenticate("jwt", { session: false }), UsuarioController.buscarUsuario);
router.get("/usuarios", passport.authenticate("jwt", { session: false }), UsuarioController.buscarTodosUsuarios);

router.put("/usuario/:id", 
    passport.authenticate("jwt", { session: false }), 
    validateBody(usuarioUpdateSchema), 
    UsuarioController.atualizarUsuario
);

router.post("/usuario/:id/foto", 
    passport.authenticate("jwt", { session: false }), 
    photoUpload.single("foto"), 
    UsuarioController.uploadImagem
);

router.delete("/usuario/:id", passport.authenticate("jwt", { session: false }), UsuarioController.deletarUsuario);
router.get("/testeAutenticacao", passport.authenticate("jwt", { session: false }), UsuarioController.testeAutenticacao);

router.post("/compras", 
    passport.authenticate("jwt", { session: false }), 
    CompraController.gerarCompra 
);

router.get("/compra/:id", 
    passport.authenticate("jwt", { session: false }), 
    CompraController.buscarCompra 
);

router.get("/compras", 
    passport.authenticate("jwt", { session: false }), 
    CompraController.buscarTodasCompras 
);

router.put("/compra/:id", 
    passport.authenticate("jwt", { session: false }), 
    CompraController.atualizarCompra 
);

router.delete("/compra/:id", 
    passport.authenticate("jwt", { session: false }), 
    CompraController.deletarCompra 
);

export default router;