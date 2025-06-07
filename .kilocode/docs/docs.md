# Memory Bank

## 概述

<figure style={{ float: 'right', width: '40%', maxWidth: '350px', margin: '0 0 10px 20px' }}>
  <img src="/docs/img/memory-bank/at-work.png" alt="使用Memory Bank执行任务" style={{ border: '1px solid grey', borderRadius: '5px', width: '100%' }} />
  <figcaption style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px', textAlign: 'center' }}>
    启用Memory Bank后Kilo Code工作效率更高，能够立即理解项目上下文和技术栈
  </figcaption>
</figure>

### 问题：AI记忆缺失

像Kilo Code这样的AI助手面临一个根本性限制：它们会在会话之间完全重置。这种"记忆缺失"意味着每次开始新会话时，您都需要重新解释项目的架构、目标、技术栈和当前状态。这造成了一个关键效率困境：AI模型要么在没有充分理解项目的情况下进行编辑（导致错误和解决方案偏差），要么必须在每个会话中花费大量时间和资源分析整个代码库（对于大型项目来说成本过高且缓慢）

如果没有解决这个记忆问题，AI助手将仍然是强大但无状态的工具，无法真正成为持续的开发伙伴。

### 解决方案：Memory Bank

Memory Bank是一个结构化文档系统，使Kilo Code能够**更好地理解您的项目**并**在编码会话之间保持上下文**。它将您的AI助手从无状态工具转变为具有完美项目细节记忆的持续开发伙伴。Kilo Code会自动读取Memory Bank文件，每当您开始新会话时重建对项目的理解。

当Memory Bank激活时，Kilo Code会在每个任务开始时显示`[Memory Bank: Active]`和项目上下文的简要摘要，确保一致的理解而无需重复解释。

## 主要优势

- **语言无关**：适用于任何编程语言或框架
- **高效项目理解**：帮助Kilo Code理解项目的用途和技术栈
- **上下文保存**：在会话之间保持项目知识，无需每次新会话都扫描文件
- **快速启动**：开始新会话时Kilo Code立即理解项目上下文
- **自文档化项目**：创建有价值的文档作为副产品

## Memory Bank工作原理

Memory Bank基于Kilo Code的[自定义规则](/advanced-usage/custom-rules)功能构建，为项目文档提供专门框架。Memory Bank文件是存储在项目仓库`.kilocode/rules/memory-bank`文件夹中的标准Markdown文件。它们不是隐藏或专有的——它们是您和Kilo Code都可以访问的常规文档文件。

在每个任务开始时，Kilo Code会读取所有Memory Bank文件以构建对项目的全面理解。这个过程会自动进行，无需您采取任何操作。Kilo Code然后通过在响应开头显示`[Memory Bank: Active]`表示Memory Bank已成功激活，后跟对项目理解的简要摘要。

文件按层次结构组织，构建项目的完整图景：

## 核心Memory Bank文件

### brief.md
*此文件由您手动创建和维护*
- 项目基础
- 项目构建内容的高级概述
- 核心需求和目标

示例：*"构建一个具有条形码扫描功能的React库存管理Web应用。该系统需要支持多个仓库并与现有ERP系统集成。"*

注意：Kilo Code不会直接编辑此文件，但如果发现可以改进项目摘要的方式会提出建议。

### product.md
- 解释项目存在的原因
- 描述要解决的问题
- 概述产品应如何工作
- 用户体验目标

示例：*"库存系统需要支持多个仓库和实时更新。它通过提供条形码扫描来实现准确的库存统计，解决库存差异问题。"*

### context.md
- 更新最频繁的文件
- 包含当前工作重点和最近更改
- 跟踪活动决策和考虑事项
- 后续开发步骤

示例：*"当前正在实现条形码扫描组件；上次会话完成了API集成。下一步包括为网络故障添加错误处理。"*

### architecture.md
- 记录系统架构
- 记录关键技术决策
- 列出使用的设计模式
- 解释组件关系
- 关键实现路径

示例：*"使用具有规范化存储结构的Redux进行状态管理。应用遵循模块化架构，具有用于API通信、状态管理和UI组件的独立服务。"*

### tech.md
- 列出使用的技术和框架
- 描述开发设置
- 记录技术限制
- 记录依赖关系和工具配置
- 工具使用模式

示例：*"React 18、TypeScript、Firebase、Jest测试。开发需要Node.js 16+并使用Vite作为构建工具。"*

## 附加上下文文件

根据需要创建附加文件来组织：
- 复杂功能文档
- 集成规范
- API文档
- 测试策略
- 部署流程

这些附加文件有助于组织不适合放入核心文件的更详细信息。

### tasks.md
*用于记录重复性任务的可选文件*
- 存储具有相似模式的工作流程
- 记录需要修改的文件
- 捕获分步流程
- 记录重要注意事项和常见问题

示例：添加对新AI模型的支持、实现API端点或任何需要重复执行相似工作的任务。

## 开始使用Memory Bank

### 首次设置

1. 在项目中创建`.kilocode/rules/memory-bank/`文件夹
2. 在`.kilocode/rules/memory-bank/brief.md`中编写基本项目摘要
3. 创建文件`.kilocode/rules/memory-bank-instructions.md`并粘贴[此文档](pathname:///downloads/memory-bank.md)
4. 切换到`Architect`模式
5. 检查是否选择了最佳可用AI模型，不要使用"轻量级"模型
6. 要求Kilo Code"initialize memory bank"
7. 等待Kilo Code分析项目并初始化Memory Bank文件
8. 验证文件内容以确认项目描述是否正确。必要时更新文件。

### 项目摘要技巧

- 从简单开始 - 可以根据需要详细或保持高级别
- 关注对您最重要的事项
- Kilo Code将帮助填补空白并提出问题
- 您可以随项目发展更新它

生成较好摘要的示例提示：

```
Provide a concise and comprehensive description of this project, highlighting its main objectives, key features, used technologies and significance. Then, write this description into a text file named appropriately to reflect the project's content, ensuring clarity and professionalism in the writing. Stay brief and short.
```

## 使用Memory Bank工作

### 核心工作流程

#### Memory Bank初始化

初始化步骤至关重要，因为它为项目的所有未来交互奠定基础。当您使用命令`initialize memory bank`请求初始化时，Kilo Code将：

1. 执行项目的详尽分析，包括：
   - 所有源代码文件及其关系
   - 配置文件和构建系统设置
   - 项目结构和组织模式
   - 文档和注释
   - 依赖关系和外部集成
   - 测试框架和模式
2. 在`.kilocode/rules/memory-bank`文件夹中创建全面的Memory Bank文件
3. 提供对项目理解的详细摘要
4. 要求您验证生成文件的准确性

:::warning 重要
初始化后请花时间仔细审查和更正生成的文件。此阶段的任何误解或缺失信息都会影响所有未来交互。彻底的初始化会显著提高Kilo Code的有效性，而仓促或不完整的初始化将永久限制其有效协助您的能力。
:::

#### Memory Bank更新

Memory Bank在以下情况更新：
1. Kilo Code发现新的项目模式
2. 实施重大更改后
3. 当您明确要求`update memory bank`时
4. 当上下文需要澄清时

要执行Memory Bank更新，Kilo Code将：
1. 审查所有项目文件
2. 记录当前状态
3. 记录见解和模式
4. 根据需要更新所有Memory Bank文件

您可以使用`update memory bank using information from @/Makefile`等命令指示Kilo Code关注特定信息源。

#### 常规任务执行

在每个任务开始时，Kilo Code：
1. 读取所有Memory Bank文件
2. 在响应开头包含`[Memory Bank: Active]`
3. 提供对项目理解的简要摘要
4. 继续执行请求的任务

在任务结束时，如果进行了重大更改，Kilo Code可能会建议更新Memory Bank，使用短语："Would you like me to update memory bank to reflect these changes?"

#### 添加任务工作流程

当您完成遵循相似模式的重复性任务时，可以将其记录以备将来参考。这对于遵循现有模式添加功能等任务特别有用。

要记录任务，使用命令`add task`或`store this as a task`。Kilo Code将：
1. 在Memory Bank文件夹中创建或更新`tasks.md`文件
2. 使用当前上下文记录任务：
   - 任务名称和描述
   - 需要修改的文件列表
   - 分步工作流程
   - 重要注意事项
   - 实现示例

当开始新任务时，Kilo Code将检查它是否匹配任何记录的任务，并遵循既定的工作流程以确保不遗漏任何步骤。

### 关键命令

- `initialize memory bank` - 新项目开始时使用
- `update memory bank` - 启动对当前任务上下文文档的全面重新分析。**注意：** 这是资源密集型的，由于可能降低有效性，不建议用于"轻量级"模型。可以多次使用，与特定指令良好结合，例如`update memory bank using information from @/Makefile`
- `add task`或`store this as a task` - 为将来参考记录重复性任务

### 状态指示器

Kilo Code使用状态指示器清晰传达Memory Bank状态：

- `[Memory Bank: Active]` - 表示Memory Bank文件已成功读取并正在使用
- `[Memory Bank: Missing]` - 表示找不到Memory Bank文件或文件为空

这些指示器出现在Kilo Code响应的开头，立即确认Memory Bank状态。

### 文档更新

Memory Bank应在以下情况下自动更新：
- 您在项目中发现新模式
- 实施重大更改后
- 当您明确要求`update memory bank`时
- 当您觉得需要澄清上下文时

## 上下文窗口管理

当您与Kilo Code一起工作时，上下文窗口最终会填满。当您注意到响应变慢或引用变得不太准确时：

1. 要求Kilo Code"update memory bank"以记录当前状态
2. 开始新的会话/任务
3. Kilo Code将在新会话中自动访问您的Memory Bank

这个过程确保了跨多个会话的连续性，而不会丢失重要上下文。

## 处理不一致

如果Kilo Code检测到Memory Bank文件之间的不一致：

1. 它将优先考虑`brief.md`中的信息作为事实来源
2. 向您指出任何差异
3. 继续使用最可靠的信息工作

这确保了即使文档不完美，Kilo Code仍然可以有效工作。

## 常见问题

### Memory Bank文件存储在哪里？
Memory Bank文件是存储在项目仓库中的常规Markdown文件，通常在`.kilocode/rules/memory-bank/`文件夹中。它们不是隐藏的系统文件——它们设计为项目文档的一部分。

### 应该多久更新一次Memory Bank？
在重要里程碑或方向变化后更新Memory Bank。对于活跃开发，每隔几次会话更新可能会有帮助。当您想确保保留所有上下文时，使用"update memory bank"命令。

### 可以手动编辑Memory Bank文件吗？
可以！虽然Kilo Code管理大多数文件，但您可以手动编辑任何文件。`brief.md`文件专门设计为由您维护。Kilo Code会尊重对其他文件的手动编辑。

### 如果Memory Bank文件缺失会发生什么？
如果Memory Bank文件缺失，Kilo Code将在响应开头显示`[Memory Bank: Missing]`并建议初始化Memory Bank。

### Memory Bank适用于所有AI模型吗？
Memory Bank适用于所有AI模型，但更强大的模型将创建更全面和准确的Memory Bank文件。轻量级模型可能难以完成分析和更新Memory Bank文件的资源密集型过程。

### 可以在多个项目中使用Memory Bank吗？
可以！每个项目在`.kilocode/rules/memory-bank/`文件夹中有自己的Memory Bank。Kilo Code会自动为每个项目使用正确的Memory Bank。

### Memory Bank不会占用上下文窗口吗？
是的，Memory Bank确实会在每个会话开始时消耗部分上下文窗口，因为它加载所有Memory Bank文件。然而，这是一个显著提高整体效率的战略性权衡。通过预先加载项目上下文：

- 您消除了随时间推移会消耗更多上下文的重复解释
- 您用更少的来回交流获得生产性结果
- 您在整个会话中保持一致的理解

测试表明，虽然Memory Bank最初使用更多token，但它显著减少了实现结果所需的总交互次数。这意味着更少的解释时间和更多的构建时间。

## 最佳实践

### 开始使用
- 从基本项目摘要开始，让结构逐渐发展
- 让Kilo Code帮助创建初始结构
- 根据需要审查和调整文件以匹配您的工作流程
- 初始化后验证生成文件的准确性

### 持续工作
- 让模式在工作中自然出现
- 不要强制文档更新——它们应该有机地发生
- 信任过程——价值会随时间积累
- 注意会话开始时的上下文确认
- 使用状态指示器确认Memory Bank处于活动状态

### 文档流程
- `brief.md`是您的基础
- `context.md`变化最频繁
- 所有文件共同维护项目情报
- 在重要里程碑或方向变化后更新

### 优化Memory Bank性能
- 保持Memory Bank文件简洁专注
- 使用附加文件进行详细文档记录
- 定期更新但不过度
- 关注特定方面时使用特定更新命令

## 记住

Memory Bank是Kilo Code与先前工作的唯一联系。它的有效性完全取决于维护清晰准确的文档并在每次交互中确认上下文保存。当您在响应开头看到`[Memory Bank: Active]`时，可以确信Kilo Code对您的项目有全面的理解。