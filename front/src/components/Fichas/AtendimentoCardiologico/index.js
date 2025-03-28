import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import InputMask from 'react-input-mask';
import { createFicha } from '../../../../services/fichaService';

import { getCurrentUsuario } from '../../../../services/userService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';

function AtendimentoCardiologico() {
    const router = useRouter();

    const [userId, setUserId] = useState(null);
    console.log("userId:", userId);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        tutorNome: "",
        tutorRg: "",
        tutorEndereco: "",
        tutorTelefone: "",
        tutorData: "",
        tutorCpf: "",
        tutorEmail: "",
        assinaturaTutor: "",
        animalNome: "",
        animalIdade: "",
        animalRaca: "",
        animalEspecie: "",
        animalSexo: "",
        animalPeso: "",
        anamnese: [],
        exameFisico: {
            nivelConsciencia: "",
            atitudePostura: "",
            acp: "",
            pulsoArterial: "",
            distensaoPulsoJugular: "",
            fc: "",
            fr: "",
            respiracao: "",
            mucosas: "",
            tpc: "",
            hidratacao: "",
            narinasTraqueiaTireoide: "",
            abdome: ""
        },
        antecedentesHistorico:""
        
    });

    useEffect(() => {
         if (typeof window !== 'undefined') {
             const storedToken = localStorage.getItem('token');
             const storedRoles = JSON.parse(localStorage.getItem('roles'));
             setToken(storedToken || "");
             setRoles(storedRoles || []);
         }
         }, []);

         useEffect(() => {
            const fetchData = async () => {
                try {
                    const userData = await getCurrentUsuario();
                    setUserId(userData.usuario.id);
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                } finally {
                    setLoading(false); // Marcar como carregado após buscar os dados
                }
            };
            fetchData();
        }, []);

        // Verifica se os dados estão carregando
        if (loading) {
            return <div className={styles.message}>Carregando dados do usuário...</div>;
        }

        // Verifica se o usuário tem permissão
        if (!roles.includes("medico")) {
            return (
                <div className={styles.container}>
                    <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
                </div>
            );
        }    

        if (!token) {
            return (
                <div className={styles.container}>
                    <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
                </div>
            );
        }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowErrorAlert(false);
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
         const fichaData = {
             nome: "Ficha de Atendimento Cardiologico",  
            Conteudo:{
                tutor: {
                    nome: formData.tutorNome,
                    cpf: formData.tutorCpf,
                    rg: formData.tutorRg,
                    telefone: formData.tutorTelefone,
                    email: formData.tutorEmail,
                    endereco: formData.tutorEndereco,
                    dataNascimento: formData.tutorData
                },
                animal: {
                    nome: formData.animalNome,
                    especie: formData.animalEspecie,
                    raca: formData.animalRaca,
                    idade: formData.animalIdade,
                    sexo: formData.animalSexo,
                    peso: formData.animalPeso
                },
                antecedentes: formData.antecedentesHistorico,
                exameFisico: formData.exameFisico,
                anamnese: formData.anamnese
            },
            dataHora: dataFormatada
        };
             
            try {
                console.log(fichaData)
                await createFicha(fichaData);
                setShowAlert(true);
            } catch (error) {
                console.error("Erro ao criar ficha:", error);
                if (error.response && error.response.data && error.response.data.code) {
                    setErrorMessage(error.response.data.message);
                }
                setShowErrorAlert(true);
            }
        };

        // Adicione a função handleChange
        const handleChange = (event) => {
            const { name, value } = event.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleCheckboxChange = (event) => {
            const { value, checked } = event.target;
            setFormData(prev => ({
                ...prev,
                anamnese: checked
                    ? [...prev.anamnese, value]
                    : prev.anamnese.filter(item => item !== value)
            }));
        };
    

    const handleExameFisicoChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            exameFisico: {
                ...prev.exameFisico,
                [name]: value
            }
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.tutorNome) {
            newErrors.tutorNome = "Nome é obrigatório";
        }
        if (!formData.tutorCpf) {
            newErrors.tutorCpf = "CPF é obrigatório";
        }
        if (!formData.tutorRg) {
            newErrors.tutorRg = "RG é obrigatório";
        }
        if (!formData.tutorTelefone) {
            newErrors.tutorTelefone = "Telefone é obrigatório";
        }
        if (!formData.tutorEmail) {
            newErrors.tutorEmail = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(formData.tutorEmail)) {
            newErrors.tutorEmail = "Email inválido";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className={styles.container}>
           
            <VoltarButton />
            <h1>Ficha de Atendimento Cardiologico</h1>
            <div className={styles.form_box}>
            <div className={styles.column}>
                        <label>Data:</label>
                        <input type="date" name="tutorData" value={formData.tutorData} onChange={handleChange} />
            </div>
            <h1 className={styles.title}>Identificação do Tutor</h1>
            {showAlert && <div className="alert alert-success">Dados salvos com sucesso!</div>}
            {showErrorAlert && <div className="alert alert-danger">Erro ao enviar o formulário. Verifique os campos.</div>}
            <form onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <label>Nome:</label>
                        <input type="text" name="tutorNome" value={formData.tutorNome} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <label>RG:</label>
                        <input type="text" name="tutorRg" value={formData.tutorRg} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                            <label>CPF:</label>
                                <InputMask
                                    mask="999.999.999-99"
                                    name="tutorCpf"
                                    value={formData.tutorCpf}
                                    onChange={handleChange}
                                >
                                    {(inputProps) => <input {...inputProps} type="text" />}
                                </InputMask>
                        </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <label>ENDEREÇO:</label>
                        <input type="text" name="tutorEndereco" value={formData.tutorEndereco} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>E-mail:</label>
                        <input type="email" name="tutorEmail" value={formData.tutorEmail} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <label>Fone:</label>
                        <input type="text" name="tutorTelefone" value={formData.tutorTelefone} onChange={handleChange} />
                    </div>
                </div>
                <h1 className={styles.title}>Identificação do Animal</h1>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <label>Nome:</label>
                        <input type="text" name="animalNome" value={formData.animalNome} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Espécie:</label>
                        <input type="text" name="animalEspecie" value={formData.animalEspecie} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <label>Idade:</label>
                        <input type="text" name="animalIdade" value={formData.animalIdade} onChange={handleChange} />
                    </div>
                <div className={styles.column}>
                    <label>Sexo:</label>
                    <select name="animalSexo" value={formData.animalSexo} onChange={handleChange}>
                        <option value="">Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <label>Raça:</label>
                        <input type="text" name="animalRaca" value={formData.animalRaca} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Peso:</label>
                        <input type="text" name="animalPeso" value={formData.animalPeso} onChange={handleChange} />
                    </div>
                </div>
                <h1 className={styles.title}>Anamnese</h1>
                <div className={styles.anamnesecontainer}>
                    {[
                        "NaoVacinado", "Vacinado", "DietaCaseira", "RacaoManutencao",
                        "RacaoComidaCaseira", "RacaoTerapeutica", "AnimalDomiciliado",
                        "AnimalSemiDomiciliado", "AreaEndemicaDirofilariose", "Profilaxias",
                        "IntoleranciaAtividadeFisica", "Dispineia", "InquietacaoNoturna",
                        "PreSincope", "Sincope", "Tosse", "EspirroReverso", "Epistaxe",
                        "PerdaVisão", "Cianose", "AumentoVolumeAbdominal", "EdemaPeriferico",
                        "Polifagia", "Poliuria", "Polidipsia", "Oliguria", "Oligodipsia",
                        "Adipsia", "Anuria", "SemAlteracoes"
                    ].map((item) => (
                        <label key={item}>
                            <input
                                type="checkbox"
                                value={item}
                                checked={formData.anamnese.includes(item)}
                                onChange={handleCheckboxChange}
                            /> {item.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                    ))}
                </div>
                <div className={styles.row}>
                    <label>Antecedentes familiares / Histórico de doenças e tratamentos / Respostas (anterior e atual):
                        <textarea name="antecedentesHistorico" value={formData.antecedentesHistorico} onChange={handleChange} rows="4" cols="50" />
                    </label>
                </div>
                
                <h1 className={styles.title}>Exame Físico</h1>
                <div className={styles.row}>
                <div className={styles.column}>
                <div className="exameFisico">
                    <label>Nível de consciência: <input type="text" name="nivelConsciencia" value={formData.exameFisico.nivelConsciencia} onChange={handleExameFisicoChange} /></label>
                    <label>Atitude/Postura: <input type="text" name="atitudePostura" value={formData.exameFisico.atitudePostura} onChange={handleExameFisicoChange} /></label>
                </div>
                <div className={styles.row}>
                    <label>ACP: <input type="text" name="acp" value={formData.exameFisico.acp} onChange={handleExameFisicoChange} /></label>
                </div>
                <div className={styles.row}>
                    <label>Pulso arterial: <input type="text" name="pulsoArterial" value={formData.exameFisico.pulsoArterial} onChange={handleExameFisicoChange} /></label>
                    <label>Distensão/Pulso Jugular: <input type="text" name="distensaoPulsoJugular" value={formData.exameFisico.distensaoPulsoJugular} onChange={handleExameFisicoChange} /></label>
                </div>
                <div className={styles.row}>
                    <label>FC: <input type="text" name="fc" value={formData.exameFisico.fc} onChange={handleExameFisicoChange} /></label>
                    <label>FR: <input type="text" name="fr" value={formData.exameFisico.fr} onChange={handleExameFisicoChange} /></label>
                    <label>Respiração: <input type="text" name="respiracao" value={formData.exameFisico.respiracao} onChange={handleExameFisicoChange} /></label>
                    <label>Mucosas: <input type="text" name="mucosas" value={formData.exameFisico.mucosas} onChange={handleExameFisicoChange} /></label>
                    <label>TPC: <input type="text" name="tpc" value={formData.exameFisico.tpc} onChange={handleExameFisicoChange} /></label>
                    <label>Hidratação: <input type="text" name="hidratacao" value={formData.exameFisico.hidratacao} onChange={handleExameFisicoChange} /></label>
                </div>
                <div className={styles.row}>
                    <label>Narinas/Traqueia/Tireóide: <input type="text" name="narinasTraqueiaTireoide" value={formData.exameFisico.narinasTraqueiaTireoide} onChange={handleExameFisicoChange} /></label>
                    <label>Abdome: <input type="text" name="abdome" value={formData.exameFisico.abdome} onChange={handleExameFisicoChange} /></label>
                </div>
                </div>
                </div>
                <button type="submit" className={styles.submitButton}>Continuar</button>
            </form>
            {<Alert message="Ficha criada com sucesso!" show={showAlert} url={`/fichaSessao`} />}
            {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
        </div>
        </div>
    )
}

export default AtendimentoCardiologico;
