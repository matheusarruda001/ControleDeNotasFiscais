// Módulo de Controle de Nota Fiscal - JavaScript Atualizado

class NotaFiscalManager {
    constructor() {
        this.apiBaseUrl = '/api';
        this.currentEditId = null;
        this.currentTipo = 'TROCA';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStats();
        this.loadNotasFiscais();
    }

    bindEvents() {
        // Botões principais
        document.getElementById('btn-nova-troca').addEventListener('click', () => this.showModal('TROCA'));
        document.getElementById('btn-nova-ocorrencia').addEventListener('click', () => this.showModal('OCORRENCIA'));
        document.getElementById('btn-importar').addEventListener('click', () => this.showImportModal());
        document.getElementById('btn-importar-produtos').addEventListener('click', () => this.showImportProdutosModal());
        document.getElementById('btn-exportar').addEventListener('click', () => this.exportExcel());
        document.getElementById('btn-filtrar').addEventListener('click', () => this.applyFilters());
        document.getElementById('btn-limpar').addEventListener('click', () => this.clearFilters());

        // Modal de nota fiscal
        document.getElementById('btn-salvar').addEventListener('click', () => this.saveNotaFiscal());
        
        // Modal de importação
        document.getElementById('btn-importar-arquivo').addEventListener('click', () => this.importExcel());
        document.getElementById('btn-importar-produtos-arquivo').addEventListener('click', () => this.importProdutos());

        // Filtros em tempo real
        document.getElementById('filter-status').addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-baixado-consignado').addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-codigo').addEventListener('input', this.debounce(() => this.applyFilters(), 500));

        // Campo tipo - mostrar/ocultar campos condicionais
        document.getElementById('tipo').addEventListener('change', (e) => this.toggleTipoFields(e.target.value));

        // Autocompletar produtos
        document.getElementById('codigo_produto').addEventListener('input', this.debounce((e) => this.searchProdutos(e.target.value), 300));
        document.getElementById('descricao').addEventListener('input', this.debounce((e) => this.searchProdutosByDescricao(e.target.value), 300));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    toggleTipoFields(tipo) {
        const campoTroca = document.getElementById('campo-numero-troca');
        const campoOcorrencia = document.getElementById('campo-numero-ocorrencia');
        
        if (tipo === 'TROCA') {
            campoTroca.style.display = 'block';
            campoOcorrencia.style.display = 'none';
        } else {
            campoTroca.style.display = 'none';
            campoOcorrencia.style.display = 'block';
        }
    }

    async searchProdutos(codigo) {
        if (!codigo || codigo.length < 2) {
            this.hideSuggestions();
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/produtos?search=${encodeURIComponent(codigo)}`);
            const result = await response.json();
            
            if (result.success && result.data.length > 0) {
                this.showSuggestions(result.data, 'codigo');
            } else {
                this.hideSuggestions();
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            this.hideSuggestions();
        }
    }

    async searchProdutosByDescricao(descricao) {
        if (!descricao || descricao.length < 3) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/produtos?search=${encodeURIComponent(descricao)}`);
            const result = await response.json();
            
            if (result.success && result.data.length > 0) {
                this.showSuggestions(result.data, 'descricao');
            }
        } catch (error) {
            console.error('Erro ao buscar produtos por descrição:', error);
        }
    }

    showSuggestions(produtos, searchType) {
        const suggestionsDiv = document.getElementById('produto-suggestions');
        
        suggestionsDiv.innerHTML = produtos.map(produto => `
            <a class="dropdown-item" href="#" onclick="notaFiscalManager.selectProduto('${produto.codigo}', '${produto.descricao}', '${produto.medida || ''}')">
                <strong>${produto.codigo}</strong> - ${produto.descricao}
                ${produto.medida ? `<small class="text-muted"> (${produto.medida})</small>` : ''}
            </a>
        `).join('');
        
        suggestionsDiv.style.display = 'block';
        suggestionsDiv.classList.add('show');
    }

    hideSuggestions() {
        const suggestionsDiv = document.getElementById('produto-suggestions');
        suggestionsDiv.style.display = 'none';
        suggestionsDiv.classList.remove('show');
    }

    selectProduto(codigo, descricao, medida) {
        document.getElementById('codigo_produto').value = codigo;
        document.getElementById('descricao').value = descricao;
        document.getElementById('medida').value = medida;
        this.hideSuggestions();
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/notas-fiscais/stats`);
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('total-count').textContent = result.data.total;
                document.getElementById('trocados-count').textContent = result.data.trocados;
                document.getElementById('devolvidos-count').textContent = result.data.devolvidos;
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    }

    async loadNotasFiscais(filters = {}) {
        try {
            this.showLoading(true);
            
            const queryParams = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await fetch(`${this.apiBaseUrl}/notas-fiscais?${queryParams}`);
            const result = await response.json();
            
            if (result.success) {
                this.renderTable(result.data);
            } else {
                this.showError('Erro ao carregar notas fiscais: ' + result.error);
            }
        } catch (error) {
            console.error('Erro ao carregar notas fiscais:', error);
            this.showError('Erro ao carregar notas fiscais');
        } finally {
            this.showLoading(false);
        }
    }

    renderTable(notas) {
        const tbody = document.getElementById('tabela-notas');
        const noDataDiv = document.getElementById('no-data');
        
        if (notas.length === 0) {
            tbody.innerHTML = '';
            noDataDiv.style.display = 'block';
            return;
        }
        
        noDataDiv.style.display = 'none';
        
        tbody.innerHTML = notas.map(nota => `
            <tr class="fade-in">
                <td>${nota.data_abertura || '-'}</td>
                <td>${nota.codigo_produto}</td>
                <td>${nota.descricao}</td>
                <td>${nota.medida || '-'}</td>
                <td>
                    <span class="badge ${nota.tipo === 'TROCA' ? 'bg-info' : 'bg-warning'}">
                        ${nota.tipo}
                    </span>
                </td>
                <td>
                    <span class="badge ${nota.status === 'TROCADO' ? 'status-trocado' : 'status-devolvido'}">
                        ${nota.status}
                    </span>
                </td>
                <td>${nota.numero_troca || '-'}</td>
                <td>${nota.numero_ocorrencia || '-'}</td>
                <td>${nota.data_troca_devolucao || '-'}</td>
                <td>${nota.nf_troca_devolucao || '-'}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge ${nota.baixado_consignado === 'SIM' ? 'bg-success' : 'bg-secondary'}">
                            ${nota.baixado_consignado === 'SIM' ? 'Sim' : 'Não'}
                        </span>
                        <button class="btn btn-sm btn-outline-primary" onclick="notaFiscalManager.toggleBaixadoConsignado(${nota.id}, '${nota.baixado_consignado}')" title="Alterar status">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="notaFiscalManager.editNota(${nota.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="notaFiscalManager.deleteNota(${nota.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showModal(tipo = 'TROCA', nota = null) {
        const modal = new bootstrap.Modal(document.getElementById('modalNotaFiscal'));
        const form = document.getElementById('formNotaFiscal');
        const title = document.getElementById('modalTitle');
        
        this.currentTipo = tipo;
        
        if (nota) {
            title.textContent = 'Editar Nota Fiscal';
            this.currentEditId = nota.id;
            this.fillForm(nota);
        } else {
            title.textContent = `Nova Nota Fiscal de ${tipo === 'TROCA' ? 'Troca' : 'Ocorrência'}`;
            this.currentEditId = null;
            form.reset();
            document.getElementById('tipo').value = tipo;
        }
        
        this.toggleTipoFields(tipo);
        modal.show();
    }

    fillForm(nota) {
        document.getElementById('data_abertura').value = nota.data_abertura || '';
        document.getElementById('codigo_produto').value = nota.codigo_produto || '';
        document.getElementById('descricao').value = nota.descricao || '';
        document.getElementById('medida').value = nota.medida || '';
        document.getElementById('tipo').value = nota.tipo || 'TROCA';
        document.getElementById('status').value = nota.status || '';
        document.getElementById('numero_troca').value = nota.numero_troca || '';
        document.getElementById('numero_ocorrencia').value = nota.numero_ocorrencia || '';
        document.getElementById('data_troca_devolucao').value = nota.data_troca_devolucao || '';
        document.getElementById('nf_troca_devolucao').value = nota.nf_troca_devolucao || '';
        
        this.toggleTipoFields(nota.tipo || 'TROCA');
    }

    async saveNotaFiscal() {
        const form = document.getElementById('formNotaFiscal');
        const formData = new FormData(form);
        
        const data = {
            data_abertura: formData.get('data_abertura'),
            codigo_produto: formData.get('codigo_produto'),
            descricao: formData.get('descricao'),
            medida: formData.get('medida'),
            tipo: formData.get('tipo'),
            status: formData.get('status'),
            numero_troca: formData.get('numero_troca'),
            numero_ocorrencia: formData.get('numero_ocorrencia'),
            data_troca_devolucao: formData.get('data_troca_devolucao'),
            nf_troca_devolucao: formData.get('nf_troca_devolucao')
        };

        try {
            const url = this.currentEditId 
                ? `${this.apiBaseUrl}/notas-fiscais/${this.currentEditId}`
                : `${this.apiBaseUrl}/notas-fiscais`;
            
            const method = this.currentEditId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                bootstrap.Modal.getInstance(document.getElementById('modalNotaFiscal')).hide();
                this.loadNotasFiscais();
                this.loadStats();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Erro ao salvar nota fiscal:', error);
            this.showError('Erro ao salvar nota fiscal');
        }
    }

    async toggleBaixadoConsignado(id, currentStatus) {
        const newStatus = currentStatus === 'SIM' ? 'NAO' : 'SIM';
        const statusText = newStatus === 'SIM' ? 'baixado do consignado' : 'não baixado do consignado';
        
        if (!confirm(`Tem certeza que deseja marcar este item como ${statusText}?`)) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/baixar-consignado/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    baixado_consignado: newStatus
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                this.loadNotasFiscais();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Erro ao alterar status de baixado do consignado:', error);
            this.showError('Erro ao alterar status de baixado do consignado');
        }
    }

    async editNota(id) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/notas-fiscais`);
            const result = await response.json();
            
            if (result.success) {
                const nota = result.data.find(n => n.id === id);
                if (nota) {
                    this.showModal(nota.tipo, nota);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar nota fiscal:', error);
            this.showError('Erro ao carregar nota fiscal');
        }
    }

    async deleteNota(id) {
        if (!confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/notas-fiscais/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                this.loadNotasFiscais();
                this.loadStats();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Erro ao excluir nota fiscal:', error);
            this.showError('Erro ao excluir nota fiscal');
        }
    }

    showImportModal() {
        const modal = new bootstrap.Modal(document.getElementById('modalImportar'));
        document.getElementById('formImportar').reset();
        modal.show();
    }

    showImportProdutosModal() {
        const modal = new bootstrap.Modal(document.getElementById('modalImportarProdutos'));
        document.getElementById('formImportarProdutos').reset();
        modal.show();
    }

    async importExcel() {
        const form = document.getElementById('formImportar');
        const formData = new FormData(form);
        
        if (!formData.get('file')) {
            this.showError('Selecione um arquivo para importar');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/notas-fiscais/import`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                if (result.errors && result.errors.length > 0) {
                    console.warn('Erros durante a importação:', result.errors);
                }
                bootstrap.Modal.getInstance(document.getElementById('modalImportar')).hide();
                this.loadNotasFiscais();
                this.loadStats();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Erro ao importar arquivo:', error);
            this.showError('Erro ao importar arquivo');
        }
    }

    async importProdutos() {
        const form = document.getElementById('formImportarProdutos');
        const formData = new FormData(form);
        
        if (!formData.get('file')) {
            this.showError('Selecione um arquivo para importar');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/produtos/import`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                if (result.errors && result.errors.length > 0) {
                    console.warn('Erros durante a importação:', result.errors);
                }
                bootstrap.Modal.getInstance(document.getElementById('modalImportarProdutos')).hide();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Erro ao importar produtos:', error);
            this.showError('Erro ao importar produtos');
        }
    }

    async exportExcel() {
        try {
            const filters = {
                status: document.getElementById('filter-status').value,
                baixado_consignado: document.getElementById('filter-baixado-consignado').value,
                codigo_produto: document.getElementById('filter-codigo').value,
                data_inicio: document.getElementById('filter-data-inicio').value,
                data_fim: document.getElementById('filter-data-fim').value
            };

            const queryParams = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await fetch(`${this.apiBaseUrl}/notas-fiscais/export?${queryParams}`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio_notas_fiscais_${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showSuccess('Relatório exportado com sucesso!');
            } else {
                this.showError('Erro ao exportar relatório');
            }
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
            this.showError('Erro ao exportar relatório');
        }
    }

    applyFilters() {
        const filters = {
            status: document.getElementById('filter-status').value,
            baixado_consignado: document.getElementById('filter-baixado-consignado').value,
            codigo_produto: document.getElementById('filter-codigo').value,
            data_inicio: document.getElementById('filter-data-inicio').value,
            data_fim: document.getElementById('filter-data-fim').value
        };

        this.loadNotasFiscais(filters);
    }

    clearFilters() {
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-baixado-consignado').value = '';
        document.getElementById('filter-codigo').value = '';
        document.getElementById('filter-data-inicio').value = '';
        document.getElementById('filter-data-fim').value = '';
        this.loadNotasFiscais();
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'block' : 'none';
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type) {
        // Criar toast dinamicamente
        const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
        
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // Remover o toast após ser ocultado
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
        return container;
    }
}

// Inicializar o gerenciador quando a página carregar
let notaFiscalManager;
document.addEventListener('DOMContentLoaded', () => {
    notaFiscalManager = new NotaFiscalManager();
    
    // Fechar sugestões ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#codigo_produto') && !e.target.closest('#produto-suggestions')) {
            notaFiscalManager.hideSuggestions();
        }
    });
});

